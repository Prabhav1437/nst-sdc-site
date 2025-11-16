'use client'

import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import './gallery.css'

// Gallery data from the HTML file
const galleryData = [
  {
    src: "https://images.unsplash.com/photo-1565687981296-535f09db714e?auto=format&fit=crop&w=1080&q=80",
    alt: "Hackathon 2024",
    caption: "Hackathon 2024"
  },
  {
    src: "https://images.unsplash.com/photo-1558301204-e3226482a77b?auto=format&fit=crop&w=1080&q=80",
    alt: "React Workshop",
    caption: "React Workshop"
  },
  {
    src: "https://images.unsplash.com/photo-1560439514-0fc9d2cd5e1b?auto=format&fit=crop&w=1080&q=80",
    alt: "Tech Conference 2024",
    caption: "Tech Conference 2024"
  },
  {
    src: "https://images.unsplash.com/photo-1693386556810-43d9451bdda5?auto=format&fit=crop&w=1080&q=80",
    alt: "Team Collaboration",
    caption: "Team Collaboration"
  },
  {
    src: "https://images.unsplash.com/photo-1603985585179-3d71c35a537c?auto=format&fit=crop&w=1080&q=80",
    alt: "Coding Session",
    caption: "Coding Session"
  },
  {
    src: "https://images.unsplash.com/photo-1723987135977-ae935608939e?auto=format&fit=crop&w=1080&q=80",
    alt: "Code Competition",
    caption: "Code Competition"
  }
];

export default function GalleryPage() {
  const [lightboxActive, setLightboxActive] = useState(false);
  const [currentImage, setCurrentImage] = useState({ src: '', caption: '' });

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    // Observe all gallery items
    itemRefs.current.forEach(item => {
      if (item) {
        item.classList.add("fade-in");
        observer.observe(item);
      }
    });

    // Cleanup observer on component unmount
    return () => {
      itemRefs.current.forEach(item => {
        if (item) {
          observer.unobserve(item);
        }
      });
    };
  }, []);

  // Keyboard event listener for Escape key (converted from gallery.js)
  useEffect(() => {
    if (!lightboxActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxActive]);

  const openLightbox = (item: { src: string, caption: string }) => {
    setCurrentImage(item);
    setLightboxActive(true);
  };

  const closeLightbox = () => {
    setLightboxActive(false);
  };

  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header">
          <h1 className="main-title">
            Our Gallery – <span className="gradient-text">Web Development Club</span>
          </h1>
          <p className="subtitle">
            Snapshots from our events, workshops & hackathons.
          </p>
          <div className="title-decoration"></div>
        </div>

        <div className="gallery-grid" id="galleryGrid">
          {galleryData.map((item, index) => (
            <div
              key={index}
              className="gallery-item"
              data-index={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => openLightbox(item)}
            >
              <div className="gallery-card">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="gallery-image"
                />
                <div className="overlay">
                  <div className="overlay-content">
                    <h3 className="caption">{item.caption}</h3>
                    <div className="view-btn">View Image</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox (converted from HTML) */}
      <div className={clsx("lightbox", { "active": lightboxActive })} id="lightbox">
        <div className="lightbox-backdrop" onClick={closeLightbox}></div>
        <div className="lightbox-content">
          <button
            className="close-btn"
            id="closeBtn"
            aria-label="Close"
            onClick={closeLightbox}
          >
            ✖
          </button>
          <div className="lightbox-image-wrapper">
            <img
              id="lightboxImage"
              src={currentImage.src}
              alt={currentImage.caption}
              className="lightbox-image"
            />
            <p id="lightboxCaption" className="lightbox-caption">
              {currentImage.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
