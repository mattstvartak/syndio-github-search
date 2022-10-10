import style from './Card.module.css';

interface Props extends React.ComponentPropsWithRef<'div'> {
  className: string;
  children: React.ReactNode;
}

/**
 * The Card element is a basic <div> container.
 * @param {string} className
 */
export const Card = ({ children, className, ...rest }: Props) => {
  return (
    <div className={`${style.card} ${className}`} {...rest}>
      {children}
    </div>
  );
};
