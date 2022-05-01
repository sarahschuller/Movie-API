# Movie_API
 
 <h1>Objective</h1>
    <p>A web application that provides users with access to information about a variety of movies, directors, and genres. Users are able to sign up, update their personal information, and create a list of their favorite movies.</p>
    
  <h1>Tools</h1>
  <ul>
 <li>Javascripit</li>
 <li>Node</li>
 <li>MongoDB</li>
 <li>Express</li>
 <li>Rest API</li>
  </ul>
    
  <h1>Features</h1>
  <table>
    <tr>
      <th>Request</th>
      <th>Type</th>
      <th>URL</th>
      <th>Returns</th>
      <th>Example</th>
      <th>Message</th>
    </tr>
    <tr>
      <td>Returns a list of all movies to the users</td>
      <td>GET</td>
      <td>/movies/:title</td>
      <td>An Array of movies within the database as a JSON object</td>
      <td>N/A</td>
      <td>N/A</td>
    </tr>
    <tr>
      <td>Return data about movies by title</td>
      <td>GET</td>
      <td>/genre/:title</td>
      <td>A JSON object with data (description, genre, genre description, director, director bio, director birth, director death, imagepath, featured) about a single movie by title</td>
      <td>Example</td>
      <td>N/A</td>
    </tr>
    <tr>
      <td>Return data about movies by genre</td>
      <td>GET</td>
      <td>/genres</td>
      <td>An array of movies by genre as a JSON object</td>
      <td>N/A</td>
      <td>N/A</td>
    </tr>
    <tr>
      <td>Register new users</td>
      <td>POST</td>
      <td>/users</td>
      <td>Create a JSON object with data about a newly registered user</td>
      <td>{ name: "John Doe" username: "johndoe123" email: "johndoe@example.com" password: "abcd123"  birthday: "01/01/01" }</td>
      <td>New User has been registered</td>
    </tr>
    <tr>
      <td>Users are able to update their information</td>
      <td>PUT</td>
      <td>/users/:username</td>
      <td>N/A</td>
      <td>{ name: "John Doe" username: "johndoe123" email: "johndoe@example.com" password: "efgh456"  birthday: "01/01/01" }</td>
      <td>User information has been updated</td>
    </tr>
    <tr>
      <td>Allow users to add a movie to their favorites list</td>
      <td>POST</td>
      <td>/users/:username/movies/:movieId</td>
      <td>Create a JSON object with data about a user's favorite movies</td>
      <td>N/A</td>
      <td>Movie has been added to user favorites</td>
    </tr>
    <tr>
      <td>Allow users to remove movies from their favorites list</td>
      <td>DELETE</td>
      <td>/users/:username/movies/:movieId</td>
      <td>Removes an item from the JSON object with the user's list of favorite movies</td>
      <td>N/A</td>
      <td>Movie has been removed from favorites</td>
    </tr>
    <tr>
      <td>Allow current users to delete their registration</td>
      <td>DELETE</td>
      <td>/users</td>
      <td>Removes a user account from the database</td>
      <td>N/A</td>
      <td>Your account was successfully deleted</td>
    </tr>
    <tr>
      <td>
        Allow users to login
      </td>
      <td>GET</td>
      <td>/login</td>
      <td>Logs the user into the application</td>
      <td>N/A</td>
      <td>N/A</td>
    </tr>
  </table>
  
 
