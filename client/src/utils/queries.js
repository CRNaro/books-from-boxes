//  The queries.js file is use to define the functionality for each query and mutation. 

import { gql } from '@apollo/client';
//took out bookcount
export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
           
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`