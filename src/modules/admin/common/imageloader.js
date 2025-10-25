import React from 'react'

const UseImageLoad = ({ item, index }) => {
    const fileName = item.filePath
    const fileNameArr = fileName.split('.');
    const fileExt = fileNameArr[fileNameArr.length - 1]
    let imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp','webp'];

    if (imageExts.indexOf(fileExt.toLowerCase()) >= 0) {
        return <div className={"imageloadercontainer " + (item.loaded ? "imageloaded" : "")}>
            <img className="" height="100" width="100" src={fileName} alt="Thumb-1" />
            {/* <div className='loader'><Skeleton height={200} width={300} /></div> */}
        </div>
    } else {
        if (fileExt === "pdf") {
            return <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
        } else if (fileExt === "zip" || fileExt === "tar" || fileExt === "rar") {
            return <i className="fa fa-file-archive-o" aria-hidden="true"></i>
        }
        else if (fileExt === "docx") {
            return <i className="fa fa-file-word-o" aria-hidden="true"></i>
        } else if (fileExt === "xls" || fileExt === "xlsx" || fileExt === "csv") {
            return <i className="fa fa-file-excel-o" aria-hidden="true"></i>
        } else if (fileExt === "mp3" || fileExt === "wav") {
            // return <i className="fa fa-file-audio-o" aria-hidden="true"></i>
            return (
                <a href={item.filePath} rel="noopener noreferrer">
                    <audio controls className="" style={{ width: '175px' }}>
                        <source src={item.filePath} />
                        Your browser does not support the audio element.
                    </audio>
                </a>
            );
        } else if (fileExt === "mp4" || fileExt === "mov" || fileExt === "avi") {
            return (
                <video href={item.filePath} controls width="250">
                    <source src={item.filePath} type={`video/${fileExt}`} />
                    Your browser does not support the video tag.
                </video>
            );
        }
        else {
            return <i className="fa fa-file" aria-hidden="true"></i>
        }
    }
}

export default UseImageLoad