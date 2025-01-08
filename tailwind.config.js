module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'], // Adjust paths as needed
  theme: {
    extend: {
      fontFamily: {
        title: ['Poppins', 'sans-serif'], // For Titles
        button: ['Montserrat', 'sans-serif'], // For Buttons
        link: ['Lato', 'sans-serif'], // For Links
        montserrat: ['Montserrat', 'sans-serif'],
        Noto_Sans: ['Noto Sans', 'sans-serif'],
        'Montserrat_Alternates': ['Montserrat Alternates', 'sans-serif'],
        
      },
      colors: {
        primary: '#D12323', //  primary color 
        secondary: '#FF9E19', // Secondary color
        alternative: '#FFFFFF', // Alternative color (e.g., white for background)
        title: '#000000', // Title color (e.g., black for titles) 
        black: '#000000', // Black for text
      },
      fontSize: {
        lg: ['18px', '24px'], 
        link: ['25px', '30.48px'],
        
      },
    },
  },
  plugins: [],
};
