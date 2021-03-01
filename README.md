Galeb Manager WebUI
===========================

Galeb Manager WebUI is a pretty interface to use [Galeb Manager](https://github.com/galeb/galeb-manager).<br/>


Building
-----

+ Install dependencies with [Bower](https://github.com/bower/bower).

>
```bash
$ bower install
```

Using
-----
First you need to change the address of backend API in `constants.js` file, by default it's `http://localhost:80`.

To run local, we need a http-server, go to project root directory and run:
>
```bash
$ npm install -g http-server
$ http-server .
```

Make RPM
-----
>
```bash
$ export GALEB_VERSION=<insert here your version number>
$ make dist
```

License
-----

```Copyright
Copyright (c) 2014-2015 Globo.com - All rights reserved.

This source is subject to the Apache License, Version 2.0.
Please see the LICENSE file for more information.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```