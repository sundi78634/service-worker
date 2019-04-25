import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './IndexPage.css';

function IndexPage({ location, dispatch }) {
  
  function goHealth() {
    // dispatch(routerRedux.push('/health'));
  }
  
  navigator.serviceWorker.addEventListener('message', function (event) {
    let action = event.data;
    console.log(`receive post-message from sw, action is '${event.data}'`);
    switch (action) {
      case 'show-book':
        // location.href = 'http://localhost:3000/health';
        dispatch(routerRedux.push('/health'));
        break;
      case 'contact-me':
        location.href = 'mailto:sundi78634@icloud.com';
        break;
      default:
        console.log('dididi');
        break;
    }
  });
  
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to Service Worker!</h1>
      <button id={'sync_button'}>同步</button>
      <div id={'cerebrum'} className={styles.welcome} onClick={goHealth}/>
      <ul className={styles.list}>
        <li>You can normal visit this web site when the network error.</li>
        <li><a href="https://github.com/sundi78634/service-worker/tree/master">sound code</a></li>
      </ul>
    </div>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
