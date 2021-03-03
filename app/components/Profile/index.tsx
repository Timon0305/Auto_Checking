import React, { useEffect, useState } from 'react';
import { Div, Button, Span, Icon } from '../common';
import RightButton from '../common/RightButton';
import TitleBar from '../common/TitleBar';
import Footer from '../common/Footer';
import ProfileList from './ProfileList';
import Controls from './Controls';
import BillingTab from './Tabs/BillingTab';
import PaymentTab from './Tabs/PaymentTab';
import { get, set, add, remove, update } from '../../utils/Profiles';
import SideMenu from '../common/SideMenu';
import ShippingTab from './Tabs/ShippingTab';
import ProfileModal from './ProfileModal';
import ProfileModel from '../../models/profile';
import { toast } from 'react-toastify';

const initialProfile: ProfileModel = {
  id: '',
  name: '',
  shipping: {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postal: '',
    phone: ''
  },
  isBillingSameAsShipping: true,
  billing: {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postal: '',
    phone: ''
  },
  ccInfo: {
    number: '',
    expiry: '/',
    cvv: '',
    name: ''
  }
};

const initialProfiles: any[] = [];

const Profile = () => {

  const [profileData, setProfileData] = useState(initialProfiles);
  const [activeProfile, setActiveProfile] = useState(initialProfile);
  const [active, setActive] = useState('shipping');
  const [visibleModal, setVisibleModal] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const loadData = async (mode: string = '') => {
    const profiles: any = await get();
    let data: any[] = [];
    Object.keys(profiles).map((key: any) => {
      // @ts-ignore
      data.push(profiles[key]);
    });
    setProfileData(data);
    if (data.length) {
      if (mode == '') {
        setActiveProfile(data[0]);
      } else if (mode == 'create') {
        setActiveProfile(data[data.length - 1]);
      } else if (mode == 'delete') {
        setActiveProfile(data[0]);
      } else {
        const item = data.find((e: any) => e.id == activeProfile.id);
        if (item) {
          setActiveProfile(item);
        }
      }
      if (mode && mode != '') {
        toast.dark(`Successfully ${mode}d...`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

    } else {
      setActiveProfile(initialProfile);
    }

  };

  const createOrUpdate = async (payload: any) => {
    const { id, name, shipping, isBillingSameAsShipping, billing, ccInfo } = payload;

    console.log(payload);
    if (id) {
      let item = profileData.find((e: any) => e.id == id);
      if (item) {
        item.name = name;
        item.shipping = shipping;
        item.isBillingSameAsShipping = isBillingSameAsShipping;
        item.billing = isBillingSameAsShipping ? shipping : billing;
        item.ccInfo = ccInfo;
        await update(item);
        await loadData('update');
      }
    } else {
      await add(payload);
      await loadData('create');
    }
    setVisibleModal(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const proTab = (type: string) => {
    setActive(type);
  };

  const handleClickListItem = (id: string) => {
    let profile = profileData.find(e => e.id === id);
    if (profile) {
      setActiveProfile(profile);
    }
  };

  const deleteProfile = async (id: string) => {
    console.log('deleteList', id);
    let profile = profileData.find(e => e.id === id);
    if (profile) {
      await remove(profile);
      await loadData('delete');
    }
  };

  const deleteAll = async () => {
    await set({});
    await loadData('');
  };

  return (
    <Div className="j-container-fluid d-flex h-100">
      <RightButton/>
      <SideMenu/>
      {visibleModal &&
      <ProfileModal modalOpen={visibleModal} setIsOpen={setVisibleModal} onOK={createOrUpdate}
                    initialValue={isEditMode ? activeProfile : initialProfile}/>
      }
      <Div className="page-container">
        <Div className="col-12">
          <TitleBar title={'Profiles'} counts={profileData.length} accountBox={true}/>
          <Controls
            create={() => {
              setVisibleModal(true);
              setEditMode(false);
            }}
            delete={deleteAll}
            profile={activeProfile.name}/>
          <Div className="space-between round-card">
            <ProfileList
              profiles={profileData} selectedId={activeProfile.id}
              onClickItem={handleClickListItem}
              onClickItemDelete={deleteProfile}
              onClickItemEdit={() => {
                setVisibleModal(true);
                setEditMode(true);
              }}/>
            {activeProfile.shipping && <Div className="col-8">
              <Div className="tab bottom-border-dotted">
                <Button className={active == 'shipping' ? 'tablinks active' : 'tablinks'}
                        onClick={() => proTab('shipping')}>
                  Shipping<Span className="pink-dot"><Icon className="fas fa-circle"/></Span>
                </Button>
                <Button className={active == 'billing' ? 'tablinks active' : 'tablinks'}
                        onClick={() => proTab('billing')}>
                  Billing<Span className="pink-dot"><Icon className="fas fa-circle"/></Span>
                </Button>
                <Button className={active == 'payment' ? 'tablinks active' : 'tablinks'}
                        onClick={() => proTab('payment')}>
                  Payment<Span className="pink-dot"><Icon className="fas fa-circle"/></Span>
                </Button>
              </Div>
              <Div className="my-40"/>
              <ShippingTab visible={active} profile={activeProfile.shipping}/>
              <BillingTab visible={active} profile={activeProfile.billing}/>
              <PaymentTab visible={active} profile={activeProfile.ccInfo}/>
            </Div>}
          </Div>
        </Div>
      </Div>
      <Footer/>

    </Div>
  );
};

export default Profile;
