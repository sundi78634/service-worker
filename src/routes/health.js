/**
 * @author Sun
 * @description health
 */

import React from 'react';
import { connect } from 'dva';
import styles from './health.less';

function Health({ location, dispatch, health }) {
  
  const { weather } = health;
  
  return (
    <div className={styles.normal}>
      <h1 className={styles.info}>{JSON.stringify(weather)}</h1>
    </div>
  );
}

export default connect(health => health)(Health);
