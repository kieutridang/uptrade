import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  logoTop: {
    position: 'relative',
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  headerIcon: {
    color: '#FFFFFF'
  },
  header: {
    backgroundColor: '#221B33'
  },
  headerTitle: {
    width: '100%',
    color: '#FFFFFF'
  },
  textSpacing: {
    width: 12,
    height: 40
  },
  textFoundRestaurant: {
    fontSize: 18,
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 10,
    marginTop: 50,
    marginBottom: 20
  },
  containerBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(7, 8, 23)'
  },
  rowTop: {
    flexDirection: 'column'
  },
  headerAccordion: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'gray',
    borderBottomColor: 'gainsboro',
    position: 'relative'
  },
  headerAccordionText: {
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
    alignSelf: 'stretch',
    fontSize: 17
  },
  headerAccordionTextOpen: {
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
    alignSelf: 'stretch',
    fontSize: 17,
    backgroundColor: '#e6e6e6'
  },
  headerAccordionIcon: {
    fontSize: 18,
    position: 'absolute',
    top: 18,
    right: 10,
    color: 'gray',
    backgroundColor: 'transparent'
  },
  contentAccordion: {
    backgroundColor: 'transparent',
    padding: 10,
    fontSize: 17,
    color: 'gray',
    lineHeight: 25
  },
  banner: {
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'stretch',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

export default styles
