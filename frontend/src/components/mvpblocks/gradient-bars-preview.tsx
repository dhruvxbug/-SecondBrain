import JoinNowButton from '../JoinNowButton';
import { GradientBars } from '../ui/gradient-bars';
import { TextReveal } from '../ui/text-reveal';

export default function GradientBarsPreview() {
  return (
    <div className="flex relative min-h-screen w-full flex-col items-center justify-center bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
         <GradientBars/>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <TextReveal className="text-foreground humane-regular text-center text-[12rem] text-white mx-auto">
          SECOND BRAIN.
        </TextReveal>
        <div className='flex items-center justify-center w-full mt-8'>
          <JoinNowButton />
        </div>
      </div>
      </div>
  );
}
