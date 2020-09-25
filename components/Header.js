import React from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from '../routes';

export default () => {
    return (
        <Menu style={{marginTop: '10px'}}>
            {/*link just gives an onclick handler for all the components it wraps, hence need to give anchor too*/}
            <Link route={"/"}>
                {/*anchor tag will give us all the cool right click features*/}
                <a className={"item"}>
                    {/*inside here you can put any other element*/}
                    CrowdCoin
                </a>
            </Link>

            <Menu.Menu position="right">
                <Link route={"/"}>
                    <a className={"item"}>
                        Campaigns
                    </a>
                </Link>
                <Link route={"/campaigns/new"}>
                    <a className={"item"}>
                        +
                    </a>
                </Link>

            </Menu.Menu>
        </Menu>
    );
}

