import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { memo } from 'react';

const AuthAnimation = memo(() => {
    return (
        <DotLottieReact
            src="/Login.lottie"
            loop
            autoplay
        />
    )
});

export default AuthAnimation;