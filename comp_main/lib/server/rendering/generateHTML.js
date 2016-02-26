import { minify } from 'html-minifier';
import onLambda from '../utils/onLambda';

export default function generateHTML(markup, serverState, is404) {
  
  /* THIS IS HORRIBLE !!! */
  
  // To be replaced with cloudfront AND process.env.CLIENT_BUNDLE_LOCATION
  const bundleLocation = 'https://s3-eu-west-1.amazonaws.com/aquest-client/';
  
  const serverStateNode = Object.keys(serverState).length ? 
    `<script>window.STATE_FROM_SERVER=${JSON.stringify(serverState)}</script>` :
    '';
  
  const jsBundleLocation = onLambda ? 
    bundleLocation + 'bundle.js' : 
    require('../../../../config/webpack.js').url + 'bundle.js';
  
  const cssBundleNode = onLambda ?
    `<link rel="stylesheet" href="${bundleLocation}bundle.css">` : 
    '';
  
  // For APIG to modify the response statusCode. Until a better solution...
  const commentFor404 = is404 ? '<!-- 404 -->' : '';   
  
  return minify(`<!DOCTYPE html>
  ${commentFor404}
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Aquest</title>
      ${cssBundleNode}
      <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAD///8A+Pj4AP7+/gDj4+MA1dXVAP39/QDi4uIA7+/vAPz8/ADh4eEA9fX1AO7u7gDn5+cA+/v7AMXFxQDZ2dkA7e3tAMTExADl5eUA3t7eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAIAAAAAAAIAAAAAAAAAABAPCwAAAAAAAAAAAAAAAAAAABADAAAAAAAAABAQDg4OAwkNDgwAAAAAABAODhAAAQ4OBQMDAAAAABAOAQACAAAODgUQDgAAAAAQDgAGDg4ODg4AAA4AAAAADhAADg4ODg4RAAAOAAAAAA4AAA4ODg4OAAoDDgAAAAAOAgIODg4RCAUQDgMAAAAAEwAADg4CBRALDgMQAAAAABMDAgoOAhIODgcAAAAAAAAQExAQDw4OBAAAAAAAAAAAChADEQoKCgAAAAAAAAAAAgAAAAATExMQAAAAAAAACAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" />
    </head>
    <body>
    <div id="root">${markup}</div>
    <script src="${jsBundleLocation}"></script>
    ${serverStateNode}
    </body>
  </html>`, {
    removeComments: false, // needed for 404s
    collapseWhitespace: true, // needed for 404s (APIG's regex '.*' does not match carriage returns, and '(.|\n)*' does't seem to work). Whitespaces should be css only.
    removeTagWhitespace: false, // 'true' is not HTML5 compliant :'( too bad for brandwidth
  });
}