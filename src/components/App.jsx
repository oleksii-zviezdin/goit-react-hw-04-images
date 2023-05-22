import { Searchbar, ImageGallery } from './index';
import { ToastContainer } from 'react-toastify';
import {  useEffect, useState, useRef } from 'react';
import { PixabayAPI } from './fetchAPI/fetchAPI';
import { LoaderWrapper, LoaderCSS } from './Loader/Loader.styled';
import { ErrorMessage } from './ErrorMessage.styled';
import { LoadMore } from './Button/Button'
import { Container } from './App.styled';

const pixabayAPI = new PixabayAPI(); 

export const App = () => {
  const [keyWord, setKeyWord] = useState('');
  const previousKeyWordRef = useRef('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [res, setRes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const handleSearchImg = searchWord => {
    setKeyWord(searchWord);
    setPage(1);
  }

  const hamdleLoadMoreButton = () => {
    setPage(prevState => prevState + 1);
  }

  useEffect(() => {
    if (!keyWord) {
      return
    }

    const fetchData = async () => {
      pixabayAPI.q = keyWord.trim();
      pixabayAPI.page = page;

      try {
        if (previousKeyWordRef.current !== keyWord) {
          setRes([])          
        }
        setError(false);
        setIsLoading(true)

        const { data: { totalHits, hits } } = await pixabayAPI.fetchPhotos();
        if (totalHits > 0) {
          const newHits = hits.map(({ id, webformatURL, largeImageURL }) => ({ id, webformatURL, largeImageURL }));
          setRes(prevState => [...prevState, ...newHits]);

          const totalPage = Math.ceil(totalHits / pixabayAPI.perPage);
          const isHasMore = totalPage !== page;
          setHasMore(isHasMore)
        } else {
          throw new Error(`Nothing was found for your query "${keyWord}".`)
        }
      }
      catch (error) {
        
        setError(error);
        setRes([]);
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    };
    fetchData();
    return () => {previousKeyWordRef.current = keyWord}
  }, [keyWord, page]);
  
    return (
      <div>
        <Searchbar handleSubmit={handleSearchImg} />
        {isLoading && <LoaderWrapper>                 
                        <LoaderCSS />
                      </LoaderWrapper>
        }
        <Container>
          {error && <ErrorMessage>{error.message}</ErrorMessage>}
          {!error && <ImageGallery res={res} />}
          {hasMore && <LoadMore handleClick={hamdleLoadMoreButton} />}</Container>
        <ToastContainer 
          position="top-center"
          theme="dark"
          autoClose={3000} />
      </div>
  );
};

// export class App extends Component{
//   state = {
//     keyWord: '',
//     isLoading: false,
//     error: false,
//     res: [],
//     page: 1,
//     hasMore: false,
//   }

//   handleSearchImg = searchWord => {
//     this.setState({
//       keyWord: searchWord,
//       page: 1,
//     })
//   }

//   hamdleLoadMoreButton = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   }

//   componentDidUpdate = async (_, prevState) => {
//     const { keyWord, page } = this.state;
//     if (prevState.keyWord !== keyWord || prevState.page !== page) {

//       pixabayAPI.q = keyWord.trim();
//       pixabayAPI.page = page;

//       try { 
//         if (prevState.keyWord !== keyWord) {
//           this.setState({
//             res: [],
//           })
//         }
        
//         this.setState({
//           error: false,
//           isLoading: true,
//         })

//         const { data: { totalHits, hits } } = await pixabayAPI.fetchPhotos()
//           if (totalHits > 0) {
//             const newHits = hits.map(({ id, webformatURL, largeImageURL }) => ({ id, webformatURL, largeImageURL }))
//             this.setState(pverState => ({
//               res: [...pverState.res, ...newHits],
//             }))

//           const totalPage = Math.ceil(totalHits / pixabayAPI.perPage);
//           this.setState({hasMore: totalPage !== page,})
//         } else {
//           throw new Error(`Nothing was found for your query "${keyWord}".`)
//         }
//       }
//       catch (error) {
//         this.setState({
//           error,
//           res: [],
//           hasMore: false,
//         })
//       } finally {
//         this.setState({ isLoading: false })
//       };
//     }
//   }
  
//   render() {
//     const { isLoading, res, error, hasMore } = this.state;
//     return (
//       <div>
//         <Searchbar handleSubmit={this.handleSearchImg} />
//         {isLoading && <LoaderWrapper>                 
//                         <LoaderCSS />
//                       </LoaderWrapper>
//         }
//         <Container>
//           {error && <ErrorMessage>{error.message}</ErrorMessage>}
//           {!error && <ImageGallery res={res} />}
//           {hasMore && <LoadMore handleClick={this.hamdleLoadMoreButton} />}</Container>
//         <ToastContainer 
//           position="top-center"
//           theme="dark"
//           autoClose={3000} />
//       </div>
//   );
//   }
// };