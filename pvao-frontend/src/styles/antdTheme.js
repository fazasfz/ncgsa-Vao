// pvao-frontend/src/styles/antdTheme.js
export const antdTheme = {
  token: {
    colorPrimary: '#C8893B',
    colorInfo: '#8A8F98',
    colorBgBase: '#0A0B0D',
    colorTextBase: '#F4EFE6',
    colorBorder: 'rgba(138, 143, 152, 0.3)',
    colorBgContainer: '#0E1013',
    colorBgElevated: '#0C1614',
    fontFamily: "'Inter', sans-serif",
    borderRadius: 0, // Observatory interfaces are sharp and precise
    wireframe: true,
  },
  components: {
    Button: {
      borderRadius: 0,
      controlHeight: 40,
      defaultBg: 'transparent',
      defaultColor: '#C8893B',
      defaultBorderColor: '#C8893B',
      primaryColor: '#0A0B0D',
      fontFamily: "'JetBrains Mono', 'Space Mono', monospace",
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    Card: {
      borderRadius: 0,
      colorBgContainer: 'transparent',
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: '#F4EFE6',
      itemSelectedColor: '#C8893B',
      itemSelectedBg: 'rgba(200, 137, 59, 0.1)',
      fontFamily: "'JetBrains Mono', 'Space Mono', monospace",
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }
  }
};
