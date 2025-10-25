import React, { useEffect, useRef, useState } from 'react'
import Breadcrums from '../common/breadcrumbs'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { getUser } from '../../../utils/commonfunction'
import { addProfile } from '../../../redux/slices/profileslice';
import { useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";
import { ROLE } from '../../../utils/Constants';


const Profile = () => {
	const {t} = useTranslation()
	const loc = useLocation()
	const inputRef = useRef(null);
	const dispatch = useDispatch();
	const [username, setUserName] = useState("")
	const [previewimage, setPreviewImage] = useState("")
	const breadcrumbs = [{ title: t("sidebar_link_dashboard"), url: "/admin/dashboard" }, { title: t("sidebar_link_user_profile"), url: "" }]


	useEffect(() => {
		const getuser = getUser(ROLE.SUPER_ADMIN)
		const trimmedName = (getuser?.name)?.slice(0,50);
		setUserName(trimmedName);
		setPreviewImage(getuser?.profile_image);
	}, [])


	const handleClick = () => {
		// 👇️ open file input box on click of another element
		inputRef.current.click();
	};

	const handleFileChange = event => {
		const file = event.target.files[0];
		const getuser = getUser()
		setPreviewImage(file ? URL.createObjectURL(file) : getuser.profile_image)
		dispatch(addProfile(file))
	}


	return (
		<>
			<Breadcrums data={breadcrumbs} />
			<div className="row square">
				<div className="col-lg-12 col-md-12">
					<div className="card custom-card">
						<div className="card-body">
							<div className="panel profile-cover">
								<div className="profile-cover__img" onClick={() => handleClick()}>
									<input
										style={{ display: 'none' }}
										ref={inputRef}
										id="profileimage"
										type="file"
										accept='image/*'
										onChange={handleFileChange}
									/>
									<div className='profileimgraper cp' style={{ height: '120px', width: '120px' }}>
										<div className='profileediticon'><i className="fa fa-pencil-square"></i></div>
										<img src={previewimage} alt="img" />
									</div>
									<h3 className="h3 text-capitalize">{username}</h3>
								</div>
								<div className="profile-cover__action bg-img" style={{backgroundImage:`url(${previewimage})`, backgroundRepeat: 'cover'}}>

								</div>
							</div>
							<div className='pt-5'></div>
							<div className="profile-tab tab-menu-heading mt-5">
								<nav className="nav main-nav-line p-3 tabs-menu profile-nav-line bg-gray-100">
									<Link className={"nav-link linkactive" + (loc.pathname.includes("edit") ? " active" : "")} to={`edit/${"1"}`}>{t("general")}</Link>
									<Link className={"nav-link linkactive" + (loc.pathname.includes("change-password") ? " active" : "")} to={`change-password/${"1"}`}>{t("change_password")}</Link>
								</nav>
							</div>
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		
		</>
	)
}

export default Profile