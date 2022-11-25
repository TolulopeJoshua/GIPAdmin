import { createSlice, configureStore } from '@reduxjs/toolkit'
import { article, biography, book } from '../types';
import FAKE_DATA from './FAKE_DATA';

const initialState = {
  loading: false,
  error: false,
  auth: {token: 'fake_1'},
  docs: { ...FAKE_DATA }
}

const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    resetStore(state, action) {
      state.loading = initialState.loading;
      state.error = initialState.error;
      state.auth = initialState.auth;
      state.docs = initialState.docs;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setAuth(state, action) {
      state.auth = action.payload;
    },
    setDocs(state, action) {
      state.docs.articles = action.payload.articles?.sort(function(a: article, b: article){
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
      state.docs.biographies = action.payload.biographies?.sort(function(a: biography, b: biography){
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
      state.docs.books = action.payload.books?.sort(function(a: book, b: book){
        let x = a.title.toLowerCase();
        let y = b.title.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
      state.docs.requests = action.payload.requests;
      state.docs.users = action.payload.users;
    },
    setBook(state, action) {
      state.docs.books = state.docs.books.map(book => {
        if (book._id == action.payload._id) {
          return action.payload
        } else {
          return book
        }
      })
    },
    deleteBook(state, action) {
      state.docs.books = state.docs.books.filter(book => book._id !== action.payload._id)
    },
    setArticle(state, action) {
      state.docs.articles = state.docs.articles.map(article => {
        if (article._id == action.payload._id) {
          return action.payload
        } else {
          return article
        }
      })
    },
    deleteArticle(state, action) {
      state.docs.articles = state.docs.articles.filter(article => article._id !== action.payload._id)
    },
    setBiography(state, action) {
      state.docs.biographies = state.docs.biographies.map(bio => {
        if (bio._id == action.payload._id) {
          return action.payload
        } else {
          return bio
        }
      })
    },
    deleteBiography(state, action) {
      state.docs.biographies = state.docs.biographies.filter(bio => bio._id !== action.payload._id)
    },
    setUser(state, action) {
      state.docs.users = state.docs.users.map(user => {
        if (user._id == action.payload._id) {
          return action.payload
        } else {
          return user
        }
      })
    },
    setRequests(state, action) {
      state.docs.requests = action.payload;
    }
  }
})

export const docsActions = docsSlice.actions

const store = configureStore({
  reducer: {docs: docsSlice.reducer}
})

export default store;