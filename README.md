## 별자취 프로젝트

<img src="https://github.com/boxak/startrail-webview/assets/38724041/c760f194-74c5-4783-9522-b1cdf86097b6" width="512px" height="250px" alt="별자취" />

<br/>

#### 개요

해당 프로젝트는 비사이드(B-side)라는 사이드 프로젝트 플랫폼을 통해 진행된 프로젝트입니다. 비사이드 15기 때 참여하여 만들어진 서비스로서 주변의 친구, 동료 등 소중한 사람들과 주고 받은 마음을 기록하는 것을 컨셉으로 하고 있습니다.

<img src="https://github.com/boxak/startrail-webview/assets/38724041/31401dfd-f9e3-402e-b23b-a595d56a080b" width="310px" alt="별자취" />
<img src="https://github.com/boxak/startrail-webview/assets/38724041/4778cab6-d5b4-4030-a50d-1162b6742da3" width="310px" alt="별자취" />
<img src="https://github.com/boxak/startrail-webview/assets/38724041/c925c15d-c7f2-439f-8887-db3cf6a30b93" width="310px" alt="별자취" />

해당 서비스는 크게 4가지 하위 서비스 로직으로 구성됩니다.

- 회원가입, 탈퇴 (React-Native로 구현)
- 유저 관리(로그인, 유저 정보 조회, 닉네임 수정, 로그아웃)
- 관계 등록
- 마음 저장

그리고 저희 앱은 React-Native로 개발하였고, 웹뷰 형식으로 웹에 빌드, 배포된 도메인을 import 함으로써 메인 화면을 보여주고 있습니다.
유저가 최초 별자취 앱 방문 시, 카카오 로그인 또는 애플 로그인의 Oauth 방식의 인증 과정을 통해 Oauth 서버에서 전송된 유저ID 시퀀스 값을 통해 해당 유저가 별자취의 유저 db에 저장된 유저인지
판별한 후, 이미 가입된 유저는 바로 메인 화면을 보여주고 신규 유저는 약관 동의 화면, 닉네임 생성 화면을 거쳐 메인 화면으로 진입하도록 유도하고 있습니다.


<img src="https://github.com/boxak/startrail-webview/assets/38724041/91b36c01-e870-4fc7-8002-71918a47185b" width="200px" alt="별자취" />
<img src="https://github.com/boxak/startrail-webview/assets/38724041/cf0417df-fd11-48f1-b2ef-48e36b09224c" width="200px" alt="별자취" />
<img src="https://github.com/boxak/startrail-webview/assets/38724041/5f9286b0-2431-4054-a792-9984d207983c" width="200px" alt="별자취" />
<img src="https://github.com/boxak/startrail-webview/assets/38724041/1f71bc36-d922-44aa-8cad-0ed6ec3dc69b" width="200px" alt="별자취" />

<br/>
<br/>

아래의 코드는 앱에서 웹뷰 안으로 유저의 jwt key(백엔드 서버에서 생성한) 값을 넘겨주는 코드입니다.

```react-native

return (
    <WebView
      ...
      injectedJavaScript={`
        (function() {
            window.postMessage('${UserStore.getJwtKey}', '*');
        })();
      `}
    />
  );

```

위와 같은 과정을 거치고 나면 메인 화면에 진입하게 됩니다. 이 때 서버에서 유저가 등록한 관계, 마음관리 정보가 다 불러올 때 까지 "react-loader-spinner" 라는 라이브러리를 사용해
스플래시 화면을 보여줌으로써 유저의 앱 이탈을 방지하고 있습니다.

<img src="https://github.com/boxak/startrail-webview/assets/38724041/2f7af9a1-0dd1-4fbf-b8f6-6e8fd0becc42" width="310px" alt="별자취" />

<br/>
<br/>

활용한 기술 스택

- FE :
  - 프로그래밍 언어 : <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=fff"/>    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=fff"/>
  - 스타일링 : <img src="https://img.shields.io/badge/Sass-CC6699?style=flat&logo=Sass&logoColor=fff"/>
  - 라이브러리 : <img src="https://img.shields.io/badge/React.js-61DAFB?style=flat&logo=React&logoColor=fff"/>
  - 상태관리 : <img src="https://img.shields.io/badge/MobX-FF9955?style=flat&logo=MobX&logoColor=fff"/>
