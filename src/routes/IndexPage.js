import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';

function IndexPage({ location }) {
  
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to Service Worker!</h1>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>You can normal visit this web site when the network error.</li>
        <li><a href="https://github.com/sundi78634/service-worker/tree/master">sound code</a></li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
