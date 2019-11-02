import React, { useState, useEffect } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import './Gallery.css';
import fetch from '../utils/fetch'
import token from '../utils/token';

export function Gallery() {
  const [images, setPhotos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const path = '/api/images';
    // const path = 'https://pixabay.com/api/?key=11039936-6e77e51408504e6821e3c708b&q=yosemite&image_type=photo&per_page=22';
    fetchPhotos(path).then(urls => {
      // console.log('urls:', urls);

      // setPhotos(urls.hits.map(url => {
      setPhotos(urls.map(url => {
        // console.log('url:', url);
        const matches = url.match(/\/([^\s/]+)\.[a-z]+$/);

        return {
          // caption: url.tags + '. Downloads ' + url.downloads,
          caption: matches ? matches[1] : '',
          // src: url.webformatURL,
          src: url + (url.includes('?') ? '&' : '?') + `token=${token}`,
        };
      }));
    });
  }, []);

  // console.log('images:', images);

  const toggleLightbox = (index) => {
    setSelectedIndex(index);
    setModalIsOpen(!modalIsOpen);
  };

  return !modalIsOpen ? <Album>
      {images.map(({ author, caption, src }, j) => (
        <Image onClick={() => toggleLightbox(j)} key={src}>
          <img
            alt={caption}
            src={src}
            style={{
              cursor: 'pointer',
              width: '97%',
              height: '94%',
              objectFit: 'cover',
            }}
          />
        </Image>
      ))}
    </Album> : <ModalGateway>
    {modalIsOpen ? (
      <Modal onClose={() => setModalIsOpen(!modalIsOpen)}>
        <Carousel views={images} currentIndex={selectedIndex} />
      </Modal>
    ) : null}
  </ModalGateway>;
}

const gutter = 4;

const Album = (props) => (
  <div
    style={{
      overflow: 'hidden',
      marginLeft: gutter,
      marginRight: gutter,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}
    {...props}
  />
);

const Image = (props) => (
  <div
    className="image-wrapper"
    {...props}
  />
);

/**
 * Fetch photos from remote.
 *
 * @returns {Promise<string[]>}
 */
async function fetchPhotos(path) {
  try {
    return await fetch(path);
  } catch (error) {
    console.error('fetchPhotos', error);

    return [];
  }
}
