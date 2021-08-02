# xml-parser

## Building and running

To build: `docker build -t xml-parser .`

To run: `docker run -p 8081:8081 xml-parser`

## Testing

You can run all the tests by running npm run test, make sure you've changed to the correct directory

## Assumptions

- It is assumed the input XML data will always be in the same format and that the XML file will be valid
- If something goes wrong, a generic error is returned, this was to save time