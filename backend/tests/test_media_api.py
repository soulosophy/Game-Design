import base64
import os
import uuid

import pytest
import requests


# Media upload/content + portfolio media persistence checks
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")


@pytest.fixture(scope="module")
def api_client():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL is not set")

    session = requests.Session()
    session.headers.update({"Accept": "application/json"})
    return session


@pytest.fixture(scope="module")
def original_portfolio(api_client):
    response = api_client.get(f"{BASE_URL.rstrip('/')}/api/portfolio", timeout=30)
    assert response.status_code == 200
    return response.json()


@pytest.fixture(scope="module")
def test_project_id(original_portfolio):
    projects = original_portfolio.get("projects", [])
    assert len(projects) > 0
    return projects[0]["id"]


@pytest.fixture
def uploaded_file_record(api_client, test_project_id):
    # 1x1 png
    png_bytes = base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
    )
    filename = f"test-upload-{uuid.uuid4().hex[:8]}.png"

    files = {"file": (filename, png_bytes, "image/png")}
    data = {"project_id": test_project_id}
    upload_response = api_client.post(
        f"{BASE_URL.rstrip('/')}/api/uploads",
        data=data,
        files=files,
        timeout=60,
    )
    assert upload_response.status_code == 200
    uploaded = upload_response.json()
    assert uploaded["project_id"] == test_project_id
    assert uploaded["media_type"] == "image"
    assert uploaded["content_type"] == "image/png"
    assert uploaded["url"].startswith("/api/uploads/")

    yield uploaded

    api_client.delete(
        f"{BASE_URL.rstrip('/')}/api/uploads/{uploaded['id']}",
        timeout=30,
    )


def test_post_uploads_returns_expected_payload(uploaded_file_record):
    assert isinstance(uploaded_file_record["id"], str)
    assert uploaded_file_record["size"] > 0
    assert uploaded_file_record["original_filename"].endswith(".png")


def test_get_upload_content_returns_binary(api_client, uploaded_file_record):
    file_id = uploaded_file_record["id"]
    content_response = api_client.get(
        f"{BASE_URL.rstrip('/')}/api/uploads/{file_id}/content",
        timeout=60,
    )
    assert content_response.status_code == 200
    assert content_response.headers.get("content-type", "").startswith("image/png")
    assert len(content_response.content) > 0


# PUT /portfolio with media_items + GET persistence verification
def test_put_portfolio_persists_media_items(api_client, original_portfolio, uploaded_file_record):
    marker = uuid.uuid4().hex[:8]
    target_project_id = uploaded_file_record["project_id"]

    payload = requests.models.complexjson.loads(requests.models.complexjson.dumps(original_portfolio))
    project = next(item for item in payload["projects"] if item["id"] == target_project_id)

    project["media_items"] = [
        {
            "id": f"uploaded-{marker}",
            "title": f"Uploaded Test {marker}",
            "type": "image",
            "source": "upload",
            "url": uploaded_file_record["url"],
            "file_id": uploaded_file_record["id"],
            "content_type": uploaded_file_record["content_type"],
        },
        {
            "id": f"url-{marker}",
            "title": f"Video URL Test {marker}",
            "type": "video",
            "source": "url",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "file_id": None,
            "content_type": None,
        },
        {
            "id": f"pdf-{marker}",
            "title": f"PDF URL Test {marker}",
            "type": "pdf",
            "source": "url",
            "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            "file_id": None,
            "content_type": None,
        },
    ]

    put_response = api_client.put(
        f"{BASE_URL.rstrip('/')}/api/portfolio",
        json=payload,
        timeout=60,
    )
    assert put_response.status_code == 200
    put_data = put_response.json()

    put_project = next(item for item in put_data["projects"] if item["id"] == target_project_id)
    assert len(put_project["media_items"]) == 3
    assert put_project["media_items"][0]["source"] == "upload"
    assert put_project["media_items"][1]["type"] == "video"
    assert put_project["media_items"][2]["type"] == "pdf"

    get_response = api_client.get(f"{BASE_URL.rstrip('/')}/api/portfolio", timeout=30)
    assert get_response.status_code == 200
    get_data = get_response.json()
    get_project = next(item for item in get_data["projects"] if item["id"] == target_project_id)
    assert len(get_project["media_items"]) == 3
    assert get_project["media_items"][0]["file_id"] == uploaded_file_record["id"]
    assert get_project["media_items"][1]["url"].startswith("https://www.youtube.com/")
    assert get_project["media_items"][2]["url"].endswith("dummy.pdf")

    restore_response = api_client.put(
        f"{BASE_URL.rstrip('/')}/api/portfolio",
        json=original_portfolio,
        timeout=60,
    )
    assert restore_response.status_code == 200
