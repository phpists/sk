import React from "react";
import Link from 'components/SlashedLink'
import {ArrowBack} from "UI";
import redirect from "lib/redirect";
import {UPDATE_USER} from "queries";
import checkLoggedIn from "lib/checkLoggedIn";
import {EditPassword} from "components/account";
import {useMutation} from "@apollo/react-hooks";
import {useTranslation} from "react-i18next";

const AccountPassword = ({user}) => {
    const [onSubmit] = useMutation(UPDATE_USER);
    const {t, i18n} = useTranslation();

    const Breadcrumbs = () => (
        <div className="container">
            <div className="flex items-center py-4">
                <ArrowBack back/>
                <div className="ml-10">
                    <Link href="/account">
                        <a className="text-red hover:text-pink">{t('common.my_account')}</a>
                    </Link>
                    <span className="px-2 text-grey">/</span>
                    {t('account.change_password')}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Breadcrumbs/>

            <div className="container">
                <div className="bg-white shadow rounded-lg p-8">
                    <div className="text-2xl font-extrabold tracking-tighter leading-none my-5 mx-3">
                        {t('account.change_password')}
                    </div>

                    <EditPassword
                        initialValues={{
                            password: "",
                            new_password: "",
                            new_password_confirmation: ""
                        }}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </>
    );
};

AccountPassword.getInitialProps = async ctx => {
    const {loggedInUser: user} = await checkLoggedIn(ctx.apolloClient);
    if (!user) {
        redirect(ctx, "/login");
    }
    return {user};
};

export default AccountPassword;
