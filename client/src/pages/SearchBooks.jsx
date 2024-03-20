import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation, useQuery, } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';

import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [saveBook, { error }] = useMutation(SAVE_BOOK);
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [savedBookIds, setSavedBookIds] = useState([]);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      // const token = Auth.loggedIn() ? Auth.getToken() : null;
      // console.log("is this a token? ", token)
      // if (!token) {
      //   return false;
      // }

      const data  = await searchGoogleBooks(searchInput);
      if (!data || !data.items) {
        throw new Error('No results found.');
      }

      const bookData = data.items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        description: book.volumeInfo.description,
        title: book.volumeInfo.title,
        link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookData) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    //console.log('token?', token);
    if (!token) {
      return false;
    }
    // if (!bookData.bookId || !bookData.authors || !bookData.title) {
    //   console.error('Missing book data');
    //   console.log("bookData: ", bookData, "token: ", token, 
    //   bookData.bookId, bookData.authors, bookData.title, bookData.image, bookData.link)
    //   return;
    // }
    const bookToSave = searchedBooks.find((book) => book.bookId === bookData.bookId);
    console.log("bookToSave: ", bookToSave)
    if (!bookToSave) {
      console.error('Missing book data');
      return;
    }
    console.log("Book data to save: ", bookData);
    try {
      const { data } = await saveBook({
        variables: { 
          bookData: {   
          bookId: bookData.bookId,
          authors: bookData.authors,
          image: bookData.image,
          description: bookData.description,
          title: bookData.title,
          link: bookData.link
        } 
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      });
      console.log("Response from saveBook: ", data)
      setSavedBookIds([...savedBookIds, bookData.bookId]);
      console.log("Updated save book IDs: ", savedBookIds)
    } catch (err) { 
      console.error('Error saving book: ', err);
    }
  };





// const SearchBooks = () => {
//   // create state for holding returned google api data
//   const [searchedBooks, setSearchedBooks] = useState([]);
//   // create state for holding our search field data
//   const [searchInput, setSearchInput] = useState('');

//   // create state to hold saved bookId values
//   const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

//   // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
//   // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
//   useEffect(() => {
//     return () => saveBookIds(savedBookIds);
//   });

//   // create method to search for books and set state on form submit
//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     if (!searchInput) {
//       return false;
//     }

//     try {
//       const response = await searchGoogleBooks(searchInput);

//       if (!response.ok) {
//         throw new Error('something went wrong!');
//       }

//       const { items } = await response.json();

//       const bookData = items.map((book) => ({
//         bookId: book.id,
//         authors: book.volumeInfo.authors || ['No author to display'],
//         title: book.volumeInfo.title,
//         description: book.volumeInfo.description,
//         image: book.volumeInfo.imageLinks?.thumbnail || '',
//         link: book.volumeInfo.infoLink || '',  // previewLink
//       }));

//       setSearchedBooks(bookData);
//       setSearchInput('');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//    const [saveBook, { error }] = useMutation(SAVE_BOOK);  // CRN update to useMutation
//   // create function to handle saving a book to our database
//   const handleSaveBook = async (bookId) => {
//     // find the book in `searchedBooks` state by the matching id
//     const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

//     // get token
//    const token = Auth.loggedIn() ? Auth.getToken() : null;
//     // console.log("is this a token? ", token)
//     // if (!token) {
//     //   return false;
//     // }

//     try {
//       // const response = await saveBook(bookToSave, token);  
//       //const { data: userData } = await saveBook({ variables: { bookData: bookToSave } });  // CRN 
//       const { data } = await saveBook({
//         variables: { 
//           bookId: bookToSave.bookId, 
//           authors: bookToSave.authors, 
//           description: bookToSave.description, 
//           title: bookToSave.title, 
//           image: bookToSave.image, 
//           link: bookToSave.link 
//         },
//         context: {
//           headers: {
//             authorization: `Bearer ${Auth.getToken()}`
//           }
//         }
//       })
     

//       // if (!response.ok) {
//       //   throw new Error('something went wrong!');
//       // }

//       // if book successfully saves to user's account, save book id to state
//       setSavedBookIds([...savedBookIds, bookToSave.bookId]);

//      // setSearchedBooks(data.saveBook.savedBooks);  
//     } catch (err) {
//       console.error(err);
//     }
//   };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks?.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <div className="text-center">
                    <a href={book.link} target="_blank" rel="noopener noreferrer" className="btn btn-info ">Buy</a>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info d-inline-block'
                        onClick={() => handleSaveBook(book)}
                        style={{ marginLeft: '10px'}}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
