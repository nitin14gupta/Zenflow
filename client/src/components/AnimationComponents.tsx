import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Floating background elements component
export const FloatingElements: React.FC<{
    elements: Array<{
        emoji: string;
        position: { top: number; left?: number; right?: number; bottom?: number };
        size: number;
        opacity: number;
        duration?: number;
    }>
}> = ({ elements }) => {
    const animations = useRef(elements.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        elements.forEach((_, index) => {
            const duration = elements[index].duration || 3000;
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animations[index], {
                        toValue: -15,
                        duration: duration,
                        useNativeDriver: true
                    }),
                    Animated.timing(animations[index], {
                        toValue: 15,
                        duration: duration,
                        useNativeDriver: true
                    }),
                ])
            ).start();
        });
    }, [animations, elements]);

    return (
        <>
            {elements.map((element, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        top: height * element.position.top,
                        left: element.position.left ? width * element.position.left : undefined,
                        right: element.position.right ? width * element.position.right : undefined,
                        bottom: element.position.bottom ? height * element.position.bottom : undefined,
                        transform: [{ translateY: animations[index] }]
                    }}
                >
                    <Text style={{
                        fontSize: element.size,
                        opacity: element.opacity
                    }}>
                        {element.emoji}
                    </Text>
                </Animated.View>
            ))}
        </>
    );
};

// Entrance animation wrapper
export const EntranceAnimation: React.FC<{
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    type?: 'fade' | 'slide' | 'scale' | 'combined';
}> = ({ children, delay = 0, duration = 800, type = 'combined' }) => {
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideUp = useRef(new Animated.Value(30)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        const animations: Animated.CompositeAnimation[] = [];

        if (type === 'fade' || type === 'combined') {
            animations.push(
                Animated.timing(fadeIn, { toValue: 1, duration, useNativeDriver: true })
            );
        }

        if (type === 'slide' || type === 'combined') {
            animations.push(
                Animated.spring(slideUp, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true })
            );
        }

        if (type === 'scale' || type === 'combined') {
            animations.push(
                Animated.spring(scale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true })
            );
        }

        const timer = setTimeout(() => {
            Animated.parallel(animations).start();
        }, delay);

        return () => clearTimeout(timer);
    }, [fadeIn, slideUp, scale, delay, duration, type]);

    const getTransform = () => {
        const transforms: any[] = [];
        if (type === 'slide' || type === 'combined') transforms.push({ translateY: slideUp });
        if (type === 'scale' || type === 'combined') transforms.push({ scale });
        return transforms;
    };

    return (
        <Animated.View style={{
            opacity: type === 'fade' || type === 'combined' ? fadeIn : 1,
            transform: getTransform()
        }}>
            {children}
        </Animated.View>
    );
};

// Staggered animation for lists
export const StaggeredAnimation: React.FC<{
    children: React.ReactNode[];
    staggerDelay?: number;
    duration?: number;
}> = ({ children, staggerDelay = 100, duration = 600 }) => {
    const animations = useRef(children.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        children.forEach((_, index) => {
            setTimeout(() => {
                Animated.spring(animations[index], {
                    toValue: 1,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }).start();
            }, index * staggerDelay);
        });
    }, [animations, children, staggerDelay]);

    return (
        <>
            {children.map((child, index) => (
                <Animated.View
                    key={index}
                    style={{
                        opacity: animations[index],
                        transform: [
                            {
                                translateY: animations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0]
                                })
                            },
                            {
                                scale: animations[index]
                            }
                        ]
                    }}
                >
                    {child}
                </Animated.View>
            ))}
        </>
    );
};

// Bounce animation component
export const BounceAnimation: React.FC<{
    children: React.ReactNode;
    duration?: number;
    amplitude?: number;
}> = ({ children, duration = 600, amplitude = 8 }) => {
    const bounce = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounce, { toValue: -amplitude, duration, useNativeDriver: true }),
                Animated.timing(bounce, { toValue: 0, duration, useNativeDriver: true }),
            ])
        ).start();
    }, [bounce, duration, amplitude]);

    return (
        <Animated.View style={{ transform: [{ translateY: bounce }] }}>
            {children}
        </Animated.View>
    );
};

// Pulse animation component
export const PulseAnimation: React.FC<{
    children: React.ReactNode;
    duration?: number;
    scale?: number;
}> = ({ children, duration = 1000, scale = 1.1 }) => {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: scale, duration, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration, useNativeDriver: true }),
            ])
        ).start();
    }, [pulse, duration, scale]);

    return (
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
            {children}
        </Animated.View>
    );
};

// Rotate animation component
export const RotateAnimation: React.FC<{
    children: React.ReactNode;
    duration?: number;
    direction?: 'clockwise' | 'counterclockwise';
}> = ({ children, duration = 20000, direction = 'clockwise' }) => {
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotate, { toValue: 1, duration, useNativeDriver: true })
        ).start();
    }, [rotate, duration]);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: direction === 'clockwise' ? ['0deg', '360deg'] : ['360deg', '0deg']
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
            {children}
        </Animated.View>
    );
};

// Gradient background component
export const GradientBackground: React.FC<{
    children: React.ReactNode;
    colors?: readonly string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
}> = ({
    children,
    colors = ['#FFF9F0', '#FFE5B4', '#B8D8E7'] as const,
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 }
}) => {
        return (
            <LinearGradient
                colors={colors as any}
                start={start}
                end={end}
                style={{ flex: 1 }}
            >
                {children}
            </LinearGradient>
        );
    };

// Typing effect component
export const TypingEffect: React.FC<{
    text: string;
    speed?: number;
    onComplete?: () => void;
    style?: any;
}> = ({ text, speed = 150, onComplete, style }) => {
    const [displayText, setDisplayText] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    return (
        <Text style={style}>
            {displayText}
            <Text style={{ opacity: 0.5 }}>|</Text>
        </Text>
    );
};
