import { StyleSheet } from 'react-native';

// Explicit shadows so iOS, Android (elevation) and web all render consistently.
export const shadow = StyleSheet.create({
  md: {
    shadowColor: '#0B0D12',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sheet: {
    shadowColor: '#0B0D12',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
});
