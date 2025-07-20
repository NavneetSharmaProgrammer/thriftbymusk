import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { useDrop } from '../../DropContext.tsx';

/**
 * A custom hook to manage countdown logic to a specific target date.
 */
const useCountdown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = React.useState(countDownDate - new Date().getTime());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownDate]);

  const getReturnValues = (countDown: number) => {
    if (countDown < 0) return [0, 0, 0, 0];
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return [days, hours, minutes, seconds];
  };
  
  return getReturnValues(countDown);
};

/**
 * A component that displays the countdown timer.
 */
const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <div className="text-2xl font-bold font-serif text-[var(--color-primary)] animate-fade-in">The drop is live!</div>;
  }
  
  const TimeBox: React.FC<{value: number, label: string}> = ({value, label}) => (
      <div className="text-center p-2 rounded-lg min-w-[60px] bg-[var(--color-surface)]/60 backdrop-blur-sm shadow-md border border-[var(--color-border)]">
          <span className="text-3xl font-bold text-[var(--color-text-primary)]">{value.toString().padStart(2, '0')}</span>
          <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider block">{label}</span>
      </div>
  )

  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 mt-6">
        <TimeBox value={days} label="Days" />
        <TimeBox value={hours} label="Hours" />
        <TimeBox value={minutes} label="Minutes" />
        <TimeBox value={seconds} label="Seconds" />
    </div>
  );
};

const ComingSoonSection: React.FC = () => {
    const { launchDate } = useDrop();
    return (
        <AnimatedSection id="coming-soon" className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">A Fresh Drop is on its Way...</h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">...and it's everything your wardrobe's been waiting for. Pastels, prints & pretty details - each piece handpicked with love. The countdown has begun!</p>
            <CountdownTimer targetDate={launchDate} />
        </AnimatedSection>
    )
}

export default ComingSoonSection;
