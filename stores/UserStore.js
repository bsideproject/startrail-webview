import axios from 'axios';
import {action, computed, makeObservable, observable} from 'mobx';

class UserStore {
  baseUrl = 'https://www.byeoljachui.com';
  jwtKey = '';
  serviceUserId = '';
  oauthServiceType = '';
  profile = {};
  agreement = {};

  constructor() {
    makeObservable(this, {
      jwtKey: observable,
      serviceUserId: observable,
      oauthServiceType: observable,
      profile: observable,
      agreement: observable,

      setJwtKey: action,
      setServiceUserId: action,
      setOauthServiceType: action,
      setAgreement: action,

      getJwtKey: computed,
      getServiceUserId: computed,
      getOauthServiceType: computed,
      getAgreement: computed,
    });
  }

  setJwtKey = key => {
    this.jwtKey = key;
  };

  get getJwtKey() {
    return this.jwtKey;
  }

  setServiceUserId = id => {
    this.serviceUserId = id;
  };

  get getServiceUserId() {
    return this.serviceUserId;
  }

  setOauthServiceType = type => {
    this.oauthServiceType = type;
  };

  get getOauthServiceType() {
    return this.oauthServiceType;
  }

  setProfile = profile => {
    this.profile = profile;
  };

  get getProfile() {
    return this.profile;
  }

  setAgreement = agreement => {
    this.agreement = agreement;
  };

  get getAgreement() {
    return this.agreement;
  }

  setNickname = nickname => {
    let data = this.getProfile;

    data.nickname = nickname;

    this.setProfile(data);
  };

  // user, sign api 처리

  async existsUser(id, type) {
    const uri = `${this.baseUrl}/api/users/${type}/${id}`;

    const response = await axios
      .get(uri)
      .then(res => {
        return res.data;
      })
      .catch(error => console.error(error));

    return response;
  }

  async signUser(id, type) {
    const request = {
      userId: {
        oauthServiceType: type,
        serviceUserId: id,
      },
    };

    const response = await axios
      .post(`${this.baseUrl}/api/sign`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        return res.data;
      })
      .catch(error => console.error(error));

    this.setJwtKey(response);

    return response;
  }

  postUser = async (userId, serviceType, data, agreement) => {
    const request = this.convertResponse2PostRequest(
      userId,
      serviceType,
      data,
      agreement,
    );
    const response = await axios
      .post(`${this.baseUrl}/api/users`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        return res;
      })
      .catch(error => console.error(error));

    return response;
  };

  convertResponse2PostRequest = (userId, serviceType, profile, agreement) => {
    // userId
    const userIdObj = {
      serviceUserId: userId,
      oauthServiceType: serviceType,
    };

    // userInformation
    let userInformation = {
      profileImageLink: '',
      profileNickname: profile.nickname,
      sexType: 'MALE',
      ageRangeType: 'TEENS',
      birth: {},
    };

    if (serviceType === 'KAKAO') {
      const birthday = profile.birthday;
      const month = parseInt(birthday.slice(0, 2));
      const day = parseInt(birthday.slice(2));

      const birthDayObj = {
        year: 0,
        month: month,
        day: day,
      };

      const sexType =
        profile.gender === 'male'
          ? 'MALE'
          : profile.gender === 'female'
          ? 'FEMALE'
          : '';

      const ageRangeText = profile.ageRange;

      let ageRange = 'UNDER_TEEN';

      switch (ageRangeText) {
        case 'AGE_0_9':
          ageRange = 'UNDER_TEEN';
          break;
        case 'AGE_10_14':
          ageRange = 'TEENS';
          break;
        case 'AGE_15_19':
          ageRange = 'TEENS';
          break;
        case 'AGE_20_29':
          ageRange = 'TWENTIES';
          break;
        case 'AGE_30_39':
          ageRange = 'THIRTIES';
          break;
        case 'AGE_40_49':
          ageRange = 'FORTIES';
          break;
        case 'AGE_50_59':
          ageRange = 'FIFTIES';
          break;
        case 'AGE_60_69':
          ageRange = 'OVER_FIFTY';
          break;
        case 'AGE_70_79':
          ageRange = 'OVER_FIFTY';
          break;
        case 'AGE_80_89':
          ageRange = 'OVER_FIFTY';
          break;
        case 'AGE_90_ABOVE':
          ageRange = 'OVER_FIFTY';
          break;
        default:
          break;
      }

      userInformation = {
        profileImageLink: profile.profileImageUrl,
        profileNickname: profile.nickname,
        sexType: sexType,
        ageRangeType: ageRange,
        birth: birthDayObj,
      };
    }

    // allowInformation

    const request = {
      userId: userIdObj,
      userInformation: userInformation,
      allowInformation: agreement,
    };

    return request;
  };
}

export default new UserStore();
