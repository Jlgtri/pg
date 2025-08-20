import { useEffect } from "react";
import styles from "./CheckPostButton.module.scss";
import cn from "classnames";
import AuthButtonBG from "../SVGs/AuthButtonBG";
import { usePostCheck } from "@/hooks/usePostCheck";

export const CheckPostButton: React.FC = () => {
  const { checkPost, loading, error, isTwitterConnected, isPostChecked } =
    usePostCheck();

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <button
      className={cn(styles.authButtonContainer, {
        [styles.completed]: isPostChecked,
      })}
      onClick={checkPost}
      disabled={!isTwitterConnected || loading || isPostChecked}
    >
      <div className={styles.authButtonBG}>
        <AuthButtonBG />
      </div>
      <div className={cn(styles.authButton)}>
        {isPostChecked ? "✓ COMPLETE" : loading ? "Loading…" : "Follow"}
      </div>
    </button>
  );
};
