
import { useEffect } from 'react';

function useMeta(title, description) {
  useEffect(() => {
    // Set the page title
    if (title) {
      document.title = title;
    }

    // Set or create meta description tag
    if (description) {
      let metaTag = document.querySelector('meta[name="description"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'description');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', description);
    }
  }, [title, description]);
}

export default useMeta;
