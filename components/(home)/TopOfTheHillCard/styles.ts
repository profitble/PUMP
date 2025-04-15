import { StyleSheet } from 'react-native'
import { Colors } from '@/constants'

export const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    fontFamily: 'SfProRounded',
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOuterRowContainer: {
    flex: 1,
  },
  infoInnerColumnContainer: {
    gap: 4,
  },
  socialsAndDescriptionContainer: {
    flex: 1,
    flexGrow: 1,
    height: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  socialsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 7,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.title,
    fontFamily: 'SfProRounded',
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 12,
    color: Colors.backgroundLight,
    fontWeight: 'bold',
    opacity: 0.5,
    fontFamily: 'SfProRounded',
  },
  metricsContainer: {
    alignItems: 'flex-end',
  },
  marketCapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontFamily: 'SfProRounded',
  },
  marketCapAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.title,
    fontFamily: 'SfProRounded',
  },
  marketCapPercentageText: {
    fontSize: 14,
    color: Colors.backgroundLight,
    opacity: 0.5,
    fontFamily: 'SfProRounded',
  },
})
