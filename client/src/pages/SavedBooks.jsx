//TODO: CRN:     *  SavedBooks.jsx:
    //  * Remove the useEffect() Hook that sets the state for UserData.
    //  * Instead, use the useQuery() Hook to execute the GET_ME query on load and 
    //    save it to a variable named userData.
    //  * Use the useMutation() Hook to execute the REMOVE_BOOK mutation in the 
    //    handleDeleteBook() function instead of the deleteBook() function that's 
    //    imported from API file. (Make sure you keep the removeBookId() function in place!)

// CRN add:
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  //const [userData, setUserData] = useState({});  CRN remove
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  console.log("SavedBooks userData: ", userData);
  console.log("SavedBooks data: ", data);
  console.log("bookData?: ", userData.savedBooks);
  //const userDataLength = userData?.savedBooks?.length;
  // use this to determine if `useEffect()` hook needs to run again
  // CRN remove
//const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
 // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
        update: (cache, { data: { removeBook } }) => {
          const { me } = cache.readQuery({ query: GET_ME });
          const updatedSavedBooks = me.savedBooks.filter(
            (book) => book.bookId !== removeBook.bookId // or (book)
          );
          const normalizedSavedBooks = updatedSavedBooks.map((book) => ({
            ...book,
            __typename: 'Book',
            id: book.bookId,
          }));
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...me, savedBooks: normalizedSavedBooks } },
         
        // update: (cache, { data: { removeBook} }) => {
        //   cache.modify({
        //     fields: {
        //       me: (existingUserData = { savedBooks: [] }) => {    // was me: (existingBookIds = []) => {
        //         const newBookList = existingUserData.savedBooks.filter(
        //           (book) => book.bookId !== removeBook.bookId
        //         );
        //         return { ...existingUserData, savedBooks: newBookList };
        //       },
        //     },
          });
        },
      });
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  }
      //CRN remove
  //     const response = await deleteBook(bookId, token);

  //     if (!response.ok) {
  //       throw new Error('something went wrong!');
  //     }

  //     const updatedUser = await response.json();
  //     setUserData(updatedUser);
  //     // upon success, remove book's id from localStorage
  //     removeBookId(bookId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  //};

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container fluid>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container fluid>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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


export default SavedBooks;
