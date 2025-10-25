import React from 'react';
import {  hasPermission } from '../../../utils/commonfunction';
import NoPermission from '../common/noPermission';

export default function CheckPermission({ Component, route }) {
  return (
      <>
          {(function () {
              if (hasPermission(route)) {
                  /**User can access this component */
                  return <Component />;
              } else {
                  /**User don't have permission */
                  return <NoPermission />;
              }
          })()}
      </>
  )
}
