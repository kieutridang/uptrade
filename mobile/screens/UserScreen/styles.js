import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  iconStyle: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'red'
  },
  gridRow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingTop: 15
  },
  gridCol: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 150
  },
  listBtnItem: {
    borderColor: '#e9e9e9',
    borderWidth: 1,
    borderRadius: 5,
    padding: 3
  },
  item: {
    marginBottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden'
  },
  thumbnail: {
    height: 150,
    marginBottom: 10,
    overflow: 'hidden'
  },
  imageThumbnail: {
    height: 150,
    maxWidth: '100%'
  },
  bottomCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15
  },
  titleCard: {
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'stretch',
    fontSize: 20,
    color: 'gray',
    marginBottom: 10
  },
  emailText: {
    fontSize: 14,
    marginBottom: 10
  }
})

export default styles
