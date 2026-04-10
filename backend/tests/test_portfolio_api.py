import os
import uuid

import pytest
import requests


# Portfolio/public API smoke and persistence checks
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")


@pytest.fixture(scope="module")
def api_client():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL is not set")

    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def original_portfolio(api_client):
    response = api_client.get(f"{BASE_URL.rstrip('/')}/api/portfolio", timeout=20)
    assert response.status_code == 200
    return response.json()


def test_api_root_health(api_client):
    response = api_client.get(f"{BASE_URL.rstrip('/')}/api/", timeout=20)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Neon portfolio API online"


def test_get_portfolio_structure(api_client):
    response = api_client.get(f"{BASE_URL.rstrip('/')}/api/portfolio", timeout=20)
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == "portfolio-main"
    assert isinstance(data["project_categories"], list)
    assert isinstance(data["projects"], list)
    assert "hero" in data and "name" in data["hero"]
    assert "resume" in data and "pdf_url" in data["resume"]


# PUT /portfolio update + GET persistence verification
def test_put_portfolio_persists_changes(api_client, original_portfolio):
    marker = f"TEST_STATUS_{uuid.uuid4().hex[:8]}"

    updated_payload = dict(original_portfolio)
    updated_payload["hero"] = dict(original_portfolio["hero"])
    updated_payload["hero"]["status"] = marker

    put_response = api_client.put(
        f"{BASE_URL.rstrip('/')}/api/portfolio", json=updated_payload, timeout=20
    )
    assert put_response.status_code == 200
    put_data = put_response.json()
    assert put_data["hero"]["status"] == marker

    get_response = api_client.get(f"{BASE_URL.rstrip('/')}/api/portfolio", timeout=20)
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["hero"]["status"] == marker

    # restore original content for stable environment
    restore_response = api_client.put(
        f"{BASE_URL.rstrip('/')}/api/portfolio", json=original_portfolio, timeout=20
    )
    assert restore_response.status_code == 200
    assert restore_response.json()["hero"]["status"] == original_portfolio["hero"]["status"]


# Contact submit + inbox retrieval integration checks
def test_post_contact_and_verify_in_inbox(api_client):
    unique = uuid.uuid4().hex[:8]
    payload = {
        "name": f"TEST User {unique}",
        "email": f"test-{unique}@example.com",
        "project_interest": f"TEST Collaboration {unique}",
        "message": f"TEST Message {unique} for verifying contact inbox linkage.",
    }

    post_response = api_client.post(
        f"{BASE_URL.rstrip('/')}/api/contact", json=payload, timeout=20
    )
    assert post_response.status_code == 200
    posted = post_response.json()
    assert posted["email"] == payload["email"]
    assert posted["message"] == payload["message"]
    assert isinstance(posted["id"], str)

    inbox_response = api_client.get(f"{BASE_URL.rstrip('/')}/api/contact-messages", timeout=20)
    assert inbox_response.status_code == 200
    messages = inbox_response.json()
    assert isinstance(messages, list)
    assert any(item["id"] == posted["id"] for item in messages)
