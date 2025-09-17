  // PROFILE PAGE _________________________________________________________________________________________
  // ______________________________________________________________________________________________________
  // Gallery Popup Image

  document.querySelectorAll('.gallery-images img').forEach(image =>{
    image.onclick = () =>{
      document.querySelector('.gallery-image-popup').style.display = 'block';
      document.querySelector('.gallery-image-popup img').src = image.getAttribute('src');
    }
  });

  document.querySelector('.gallery-image-popup span').onclick = () =>{
    document.querySelector('.gallery-image-popup').style.display = 'none';
  }