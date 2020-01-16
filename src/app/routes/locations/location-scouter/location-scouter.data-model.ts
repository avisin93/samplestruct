
export class LocationScouterListData {
    /**
     * It generates structured data list as required.
     * @param data Raw data of list of scouters received from server.
     */
    static getScoutersList(data) {
        const scoutersList = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const scouterData = {
                    'id': data[i].id ? data[i].id : '',
                    'name': data[i].i18n && data[i].i18n.displayName ? data[i].i18n.displayName : '',
                    'email': data[i].email ? data[i].email : '',
                    'rolePermission': data[i].rolePermission ? data[i].rolePermission : []
                };
                scoutersList.push(scouterData);
            }
        }
        return scoutersList;
    }
    /**
     * It generates structured data scouter as required to be sent to server.
     * @param scouter data of particular scouter
     */
    static setScouterAccessData(scouter) {
        if (scouter) {
            const scouterData = {
                'id': scouter.id ? scouter.id : '',
                'rolePermission': scouter.rolePermission ? scouter.rolePermission : []
            };
            return scouterData;
        }
    }
}
