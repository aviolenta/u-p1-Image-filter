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
  const isImageUrl = require('is-image-url');
  const url = require('valid-url');
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
      let { image_url } = req.query;
      console.log(isImageUrl(image_url));
      const isURL = url.isUri(image_url)==undefined;
      console.log(isURL);
      
      //    1. validate the image_url query
      if (!(isImageUrl(image_url))) {
            return res.status(400).send(`A valid Image URL is required`);}
      else if ((isURL)== true) {
            return res.status(406).send(`Not valid Image URL!`);}
      else{      
      //    2. call filterImageFromURL(image_url) to filter the image
            await filterImageFromURL(image_url)
      //    3. send the resulting file in the response
            .then(function (filteredpath){res.status(200).sendFile(filteredpath, 
      //    4. deletes any files on the server on finish of the response
            () => deleteLocalFiles([filteredpath]))});}
      });
   /**************************************************************************** */
  //! END @TODO1
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${port}`);
      console.log( `press CTRL+C to stop server` );
  });

})();
