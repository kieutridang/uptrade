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
    width: '100%',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    marginBottom: 20
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
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  titleCard: {
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'stretch',
    fontSize: 20,
    color: 'gray',
    marginBottom: 10
  },
  dayText: {
    fontSize: 14,
    marginBottom: 10
  },
  countItems: {
    borderRadius: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#DB5461',
    marginBottom: 10,
    padding: 5
  },
  countItemsText: {
    textTransform: 'uppercase',
    fontSize: 12,
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white'
  },
  bottomCardText: {
    padding: 5,
    textTransform: 'uppercase',
    fontSize: 14,
    borderRadius: 5,
    color: 'rgb(0, 185, 174)',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right',
    alignSelf: 'stretch'
  }
})

export default styles
