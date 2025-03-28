import { createGlobalStyle } from "styled-components";

const GlobalFonts = createGlobalStyle`
  :root {
    --font-roboto: 'Roboto', sans-serif;
    --font-roboto-condensed: 'Roboto Condensed', sans-serif;
    --font-oswald: 'Oswald', sans-serif;
  }
`;

export default GlobalFonts;
