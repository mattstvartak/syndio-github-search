import style from './LoadingIcon.module.css';

/**
 * An animated loading icon
 */
export const LoadingIcon = () => (
  <div className={style.loadingIcon}>
    <div className={style.loadingIconDot}></div>
    <div className={style.loadingIconDot}></div>
    <div className={style.loadingIconDot}></div>
  </div>
);
