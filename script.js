// Helper function to extract content based on keyword or heading
function extractSectionByKeyword(html, keyword) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const elements = Array.from(doc.body.children);
  let started = false;
  let result = "";

  for (let el of elements) {
    const text = el.textContent.trim();
    if (!started && text.includes(keyword)) {
      started = true;
    }

    if (started) {
      result += el.outerHTML;
    }
  }

  return result || `<p>${keyword} section not found.</p>`;
}

// === 1. SUMMARY: from post 39145, only <p> with <strong>NEW YORK</strong> ===
fetch("https://eclerx.com/wp-json/wp/v2/posts/39145")
  .then(res => res.json())
  .then(data => {
    const doc = new DOMParser().parseFromString(data.content.rendered, "text/html");
    const strongTags = doc.querySelectorAll("strong");

    let summaryHTML = "";
    strongTags.forEach(strong => {
      if (strong.textContent.trim() === "NEW YORK") {
        const parent = strong.closest("p") || strong.parentElement;
        if (parent) {
          summaryHTML = parent.outerHTML;
        }
      }
    });

    document.getElementById("summary-content").innerHTML =
      summaryHTML || "<p>Summary section not found.</p>";
  })
  .catch(err => {
    console.error("Error loading Summary:", err);
  });

// === 2 & 3: from post 51641 ===
fetch("https://eclerx.com/wp-json/wp/v2/posts/51641")
  .then(res => res.json())
  .then(data => {
    const doc = new DOMParser().parseFromString(data.content.rendered, "text/html");
    const strongTags = doc.querySelectorAll("strong");

    let subscribeHTML = "";
    let aboutStartNode = null;

    strongTags.forEach(strong => {
      const text = strong.textContent.trim();

      // === 2. SUBSCRIBE: Only show heading paragraph
      if (text === "NEW YORK, April 24, 2025:") {
        const parent = strong.closest("p") || strong.parentElement;
        if (parent) {
          subscribeHTML = parent.outerHTML;
        }
      }

      // === 3. ABOUT: Save starting point
      if (text === "About eClerx") {
        aboutStartNode = strong.closest("p") || strong.parentElement;
      }
    });

    document.getElementById("subscribe-content").innerHTML =
      subscribeHTML || "<p>Subscribe section not found.</p>";

    // === Extract content AFTER About eClerx heading block ===
    let aboutHTML = "";
    if (aboutStartNode) {
      let current = aboutStartNode.nextElementSibling;

      while (current && !current.querySelector("strong")) {
        aboutHTML += current.outerHTML;
        current = current.nextElementSibling;
      }
    }

    document.getElementById("about-content").innerHTML =
      aboutHTML || "<p>About section not found.</p>";
  })
  .catch(err => {
    console.error("Error loading Subscribe/About:", err);
  });


// Back to top button
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Share links
const url = encodeURIComponent(window.location.href);
document.getElementById('share-x').href = `https://twitter.com/intent/tweet?url=${url}`;
document.getElementById('share-linkedin').href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

const swiper = new Swiper('.mySwiper', {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 1,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    768: {
      slidesPerView: 3,
    }
  }
});
