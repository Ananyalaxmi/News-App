import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async ()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews(); 
        // eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {   
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1) 
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                > 
                    <div className="container">
                         
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>
            </>
        )
    
}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
// export class News extends Component {
//   static defaultProps={
//     country: 'in',
//     pageSize:8,
//     category: 'general'
//   }
//   static propTypes={
//     country:PropTypes.string,
//     pageSize:PropTypes.number,
//     category:PropTypes.string
//   }
//   constructor(props){
//     super();
//     this.state={
//       articles:[],
//       loading:false,
//       page:1,
//     }
//     document.title=`${this.props.category}-NewsMonkey`;
// }
// async updateNews(){
//   const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKeydbe57b028aeb41e285a226a94865f7a7&page=1&pageSize=${this.props.pageSize}`;
//   let data=await fetch(url);
//   let parsedData=await data.json()
//   console.log(parsedData);
//   this.setState({articles: parsedData.articles,totalResults:parsedData.totalResults})

// }
// async componentDidMount(){
//   // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKeydbe57b028aeb41e285a226a94865f7a7&page=1&pageSize=${this.props.pageSize}`;
//   // let data=await fetch(url);
//   // let parsedData=await data.json()
//   // console.log(parsedData);
//   // this.setState({articles: parsedData.articles,totalResults:parsedData.totalResults})
//   this.updateNews();
// }
// handlePreviousClick=async ()=>{
// // console.log("previous")
// // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKeydbe57b028aeb41e285a226a94865f7a7&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
// //   let data=await fetch(url);
// //   let parsedData=await data.json()
// //   console.log(parsedData);
// //   this.setState({
// //     page:this.state.page-1,
// //     articles: parsedData.articles
// //   })
// this.setState({page: this.state.page-1});
// this.updateNews();

// }
// handleNextClick=async ()=>{
// //   console.log("next");
// // if(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)){
// //   let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKeydbe57b028aeb41e285a226a94865f7a7&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
// //   let data=await fetch(url);
// //   let parsedData=await data.json();
// //   this.setState({
// //     page:this.state.page-1,
// //     articles: parsedData.articles
// //   })

// //}
// this.setState({page:this.state.page+1});
// this.updateNews();
// }
//   render() {
//     return (
//         <div className="container my-3">
//           <h1 className="text-center">NewsMonkey-Top Headlines</h1>
//           <div className='row'>
//           {this.state.articles.map((element)=>{
//             return <div className="col-md-3"  key={element.url}>
//             <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
//         </div>
//           })}    
//         </div>
//         <div className="container d-flex justify-content-between">
//         <button disabled={this.state.page<=1} type="button" class="btn btn-dark" onClick={this.handlePreviousClick}>&larr; Previous</button>
//         <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
//         </div>
//       </div>
//     )
//   }
// }
// export default News
