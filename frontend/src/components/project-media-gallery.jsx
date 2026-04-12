const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const toAbsoluteUrl = (url) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${BACKEND_URL}${url}`;
};

const getVideoEmbedUrl = (url) => {
  const absoluteUrl = toAbsoluteUrl(url);

  try {
    const parsed = new URL(absoluteUrl);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
  } catch (error) {
    return null;
  }

  return null;
};

export const ProjectMediaGallery = ({ mediaItems = [], testIdPrefix = "project-media" }) => {
  const images = mediaItems.filter((item) => item.type === "image");
  const videos = mediaItems.filter((item) => item.type === "video");
  const pdfs = mediaItems.filter((item) => item.type === "pdf");

  if (mediaItems.length === 0) {
    return (
      <div className="border border-dashed border-white/15 bg-white/5 p-8 text-center" data-testid={`${testIdPrefix}-empty-state`}>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`${testIdPrefix}-empty-label`}>
          Media library ready
        </p>
        <p className="mt-3 text-sm text-foreground/75" data-testid={`${testIdPrefix}-empty-copy`}>
          Add images, videos, or PDFs in the Studio to populate this project detail page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10" data-testid={`${testIdPrefix}-wrapper`}>
      {images.length > 0 ? (
        <section className="space-y-4" data-testid={`${testIdPrefix}-images-section`}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary" data-testid={`${testIdPrefix}-images-label`}>
            Images
          </p>
          <div className="grid gap-4 md:grid-cols-2" data-testid={`${testIdPrefix}-images-grid`}>
            {images.map((item, index) => (
              <figure className="overflow-hidden border border-white/10 bg-black/60" data-testid={`${testIdPrefix}-image-card-${index}`} key={item.id}>
                <img
                  alt={item.title}
                  className="aspect-[16/10] w-full object-cover object-center"
                  data-testid={`${testIdPrefix}-image-${index}`}
                  src={toAbsoluteUrl(item.url)}
                />
                <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-foreground/75" data-testid={`${testIdPrefix}-image-title-${index}`}>
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {videos.length > 0 ? (
        <section className="space-y-4" data-testid={`${testIdPrefix}-videos-section`}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary" data-testid={`${testIdPrefix}-videos-label`}>
            Videos
          </p>
          <div className="grid gap-4 md:grid-cols-2" data-testid={`${testIdPrefix}-videos-grid`}>
            {videos.map((item, index) => {
              const embedUrl = getVideoEmbedUrl(item.url);
              const resolvedUrl = toAbsoluteUrl(item.url);

              return (
                <div className="space-y-3 border border-white/10 bg-black/60 p-4" data-testid={`${testIdPrefix}-video-card-${index}`} key={item.id}>
                  {embedUrl ? (
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-video w-full border border-white/10"
                      data-testid={`${testIdPrefix}-video-embed-${index}`}
                      src={embedUrl}
                      title={item.title}
                    />
                  ) : (
                    <video className="aspect-video w-full border border-white/10 bg-black" controls data-testid={`${testIdPrefix}-video-file-${index}`} src={resolvedUrl} />
                  )}
                  <p className="text-sm text-foreground/75" data-testid={`${testIdPrefix}-video-title-${index}`}>
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {pdfs.length > 0 ? (
        <section className="space-y-4" data-testid={`${testIdPrefix}-pdfs-section`}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent" data-testid={`${testIdPrefix}-pdfs-label`}>
            PDFs
          </p>
          <div className="grid gap-6" data-testid={`${testIdPrefix}-pdfs-grid`}>
            {pdfs.map((item, index) => {
              const resolvedUrl = toAbsoluteUrl(item.url);

              return (
                <div className="space-y-3 border border-white/10 bg-black/60 p-4" data-testid={`${testIdPrefix}-pdf-card-${index}`} key={item.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground" data-testid={`${testIdPrefix}-pdf-title-${index}`}>
                      {item.title}
                    </p>
                    <a
                      className="font-mono text-xs uppercase tracking-[0.2em] text-secondary hover:text-primary"
                      data-testid={`${testIdPrefix}-pdf-open-link-${index}`}
                      href={resolvedUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open PDF
                    </a>
                  </div>
                  <iframe
                    className="h-[28rem] w-full border border-white/10 bg-white"
                    data-testid={`${testIdPrefix}-pdf-frame-${index}`}
                    src={resolvedUrl}
                    title={item.title}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
};