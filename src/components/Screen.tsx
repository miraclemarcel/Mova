import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  className?: string;
  /** Wrap in a KeyboardAvoidingView so footers stay above the keyboard. */
  keyboard?: boolean;
  edges?: ('top' | 'bottom')[];
};

export function Screen({ children, className = '', keyboard, edges = ['top', 'bottom'] }: Props) {
  const insets = useSafeAreaInsets();
  const content = (
    <View
      className={`flex-1 bg-white ${className}`}
      style={{
        paddingTop: edges.includes('top') ? insets.top : 0,
        paddingBottom: edges.includes('bottom') ? Math.max(insets.bottom, 16) : 0,
      }}
    >
      {children}
    </View>
  );

  if (!keyboard) return content;
  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {content}
    </KeyboardAvoidingView>
  );
}
