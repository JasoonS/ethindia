import React from 'react';
import IPFS from 'ipfs' 
// import ImageUploader from 'react-images-upload';

class UploadImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { pictures: [], image : null };
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
            pictures: this.state.pictures.concat(pictureFiles),
        });
    }

    handleChangeImage = (evt) => {
        console.log("Uploading");
        var reader = new FileReader();
        var file = evt.target.files[0];
    
        reader.onload = (upload) => {
            this.setState({
                image: upload.target.result
            });
            const node = new IPFS()

const data = upload.target.result

// once the node is ready
node.once('ready', () => {
  // convert your data to a Buffer and add it to IPFS
  node.add(IPFS.Buffer.from(data), (err, files) => {
    if (err) return console.error(err)

    // 'hash', known as CID, is a string uniquely addressing the data
    // and can be used to get it again. 'files' is an array because
    // 'add' supports multiple additions, but we only added one entry
    console.log("files[0].hash")
    console.log(files[0].hash)
    this.props.updateImageHashOnSmartContract(files[0].hash)
  })
})
        };
        reader.readAsDataURL(file);
        console.log(this.state.image);
        console.log("Uploaded");
    }

    render() {
        return (
            <div>

                {/* <ImageUploader
                    withIcon={true}
                    buttonText='Choose images'
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                    maxFileSize={5242880}
                    withPreview={true}
                /> */}

<input ref="file" type="file" name="file" 
                              className="upload-file" 
                              id="file"
                              onChange={this.handleChangeImage}
                              encType="multipart/form-data" 
                              required/>

                {
                    // console.log(this.state.pictures)
                        // console.log('this.state.image')
                         console.log(this.state.image) 
                        }
            </div>
        );
    }
}

export default UploadImage