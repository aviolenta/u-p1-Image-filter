import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // --- Added NPM is-image-url to verify 
  // const isImageUrl = require('is-image-url');

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  // IT SHOULD:
  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage", async (req, res) => {
    try{
          let { image_url } = req.query;
    //    1. validate the image_url query
          if (!image_url) {
            return res.status(400).send(`Image URL is required`);}
    //    2. call filterImageFromURL(image_url) to filter the image
          filterImageFromURL(image_url)
    //    3. send the resulting file in the response
          .then(function (filteredpath){ res.status(200).sendFile(filteredpath,
    //    4. deletes any files on the server on finish of the response
          () => deleteLocalFiles([filteredpath]))})
    }
    catch(error){
      res.status(400).send(`Not able to filter image`)};
  });
   /**************************************************************************** */
  //! END @TODO1
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${port}`);
      console.log( `press CTRL+C to stop server` );
  });

})();
