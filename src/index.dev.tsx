import React from 'react';
import { createRoot } from 'react-dom/client';

import Tooltip from './index';

export default {};
const longContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu tempus velit, nec finibus libero. Vivamus sed ullamcorper nunc, porta placerat mi. Curabitur eu ligula nec diam commodo commodo. Pellentesque euismod libero nisi, ac consectetur lacus suscipit a. Pellentesque condimentum, dolor nec rutrum placerat, neque dolor euismod erat, in vehicula urna elit eu orci. Mauris consequat erat eu lacus luctus vulputate. Duis ac lectus mauris. Mauris sagittis dictum justo, facilisis porttitor nulla scelerisque fringilla.

Donec et semper elit, rhoncus faucibus dui. Suspendisse sit amet rhoncus magna. Aenean tempus libero turpis, vel blandit diam lacinia in. Mauris euismod efficitur tellus et laoreet. Mauris tincidunt lacus a purus maximus luctus eget posuere risus. Curabitur molestie lorem ex, vel luctus tortor porta eget. Sed purus elit, mattis eu nunc a, dictum pretium ipsum. Duis sed finibus nulla, non consectetur magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque efficitur, ipsum nec vulputate mattis, risus augue feugiat quam, nec venenatis lorem est in nulla. Vestibulum sagittis at erat non placerat.

Maecenas in augue quis enim bibendum facilisis. Donec sed libero quis tellus laoreet aliquet. Sed gravida mi ac nibh tincidunt efficitur. Ut volutpat ante nec sem imperdiet, pretium sagittis arcu laoreet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer semper gravida lectus. Sed luctus venenatis ornare.

Nulla ligula diam, rutrum quis ornare sit amet, tincidunt ut dui. Praesent tempor dapibus erat, sit amet commodo mi dapibus eu. Fusce eros nibh, rutrum a sem et, feugiat consequat lectus. Maecenas sollicitudin ex arcu, vestibulum sodales ante eleifend sollicitudin. Donec id nibh mauris. Duis vestibulum ligula eu leo tempus semper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce eget metus orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed ante erat, feugiat id sem ac, varius interdum justo. Proin et metus ac risus consectetur ornare. Vivamus quis arcu accumsan, dignissim dolor eget, lobortis risus. Aliquam imperdiet, eros non bibendum suscipit, eros leo feugiat odio, vitae cursus diam risus quis risus.

Fusce vel egestas dolor. Nullam placerat placerat augue ut eleifend. Aliquam porttitor sem elementum dolor luctus molestie. Vestibulum scelerisque ultricies venenatis. Duis consectetur, ante quis dignissim iaculis, tellus ipsum gravida est, ac tempor sem nunc ut tellus. Vestibulum erat magna, imperdiet non aliquet sed, placerat sit amet risus. Duis eget est ex. In sit amet ultrices turpis, ut luctus justo. Nullam et mauris eu ligula dapibus fermentum. Pellentesque vel nunc viverra, semper velit faucibus, tincidunt sem.`;

export function Test() {
  return (
    <div
      style={{
        height: '1000px',
        width: '2000px',
        padding: '1000px',
        background: '#eee',
      }}
    >
      <Tooltip content={longContent} offset={25}>
        <button disabled>Hover click</button>
      </Tooltip>
      <Tooltip
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        placement="bottom"
      >
        <button>bottom</button>
      </Tooltip>
      <Tooltip
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        placement="top"
        style={{
          backgroundColor: '#101828',
          padding: '8px 12px',
          color: 'white',
          borderRadius: '8px',
        }}
        offset={0}
        arrowSize={20}
        arrow
      >
        <button>top</button>
      </Tooltip>
      <Tooltip
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        placement="left"
        offset={0}
        style={{
          backgroundColor: '#101828',
          padding: '8px 12px',
          color: 'white',
          borderRadius: '8px',
        }}
        arrow
      >
        <button>left</button>
      </Tooltip>
      <Tooltip
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        placement="top-start"
        offset={0}
        style={{
          backgroundColor: '#101828',
          padding: '8px 12px',
          color: 'white',
          borderRadius: '8px',
        }}
        arrow
      >
        <button>top-start</button>
      </Tooltip>
      <Tooltip
        style={{
          backgroundColor: '#101828',
          padding: '8px 12px',
          color: 'white',
          borderRadius: '8px',
        }}
        offset={0}
        arrow
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        placement="top-end"
      >
        <button>top-end</button>
      </Tooltip>
      <Tooltip
        offset={0}
        style={{
          color: 'white',
        }}
        arrow
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        placement="bottom"
      >
        <button>bottom</button>
      </Tooltip>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>,
);
