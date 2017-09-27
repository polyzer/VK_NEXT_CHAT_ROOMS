var _StoreWindow = function ()
{
	this.onOpacityRangeInputChangeBF = this.onOpacityRangeInputChange.bind(this);
	this.onFaceColorInputChangeBF = this.onFaceColorInputChange.bind(this);
	this.onEdgeColorInputChangeBF = this.onEdgeColorInputChange.bind(this);
	this.updateBF = this.update.bind(this);
	this.onOpenBF = this.onOpen.bind(this);
	this.onCloseBF = this.onClose.bind(this);
	this.onSaveBF = this.onSave.bind(this);
	this.onShowNextObjectButtonClickBF = this.onShowNextObjectButtonClick.bind(this);
	this.onShowPrevObjectButtonClickBF = this.onShowPrevObjectButtonClick.bind(this);
	this.onBuyObjectButtonClickBF = this.onBuyObjectButtonClick.bind(this);

	this.onSaveSuccessBF = this.onSaveSuccess.bind(this);
	this.onSaveErrorBF = this.onSaveError.bind(this);

	this.updating = false;

	this.StoreWindowDiv = document.createElement("div");
	this.StoreWindowDiv.setAttribute("id", "StoreWindowDiv");

	/*Кнопка закрытия магазина*/
	this.CloseWindowButton = document.createElement("div");
	this.CloseWindowButton.setAttribute("id", "CloseWindowButton");
	this.CloseWindowButton.appendChild(document.createTextNode("Закрыть"));
	this.CloseWindowButton.addEventListener("click", this.onCloseBF);

	/*Сохраняем данные*/
	this.SaveOptionsButton = document.createElement("div");
	this.SaveOptionsButton.setAttribute("id", "SaveCustomizeOptionsButton");
	this.SaveOptionsButton.appendChild(document.createTextNode("Сохранить"));
	this.SaveOptionsButton.addEventListener("click", this.onSaveBF);

	/*Кнопка, по нажатию на которую показывается следующий объект (слева)*/
	this.ShowNextObjectButton = document.createElement("div");
	this.ShowNextObjectButton.setAttribute("id", "ShowNextObjectButton");
	this.ShowNextObjectButton.addEventListener("click", this.onShowNextObjectButtonClickBF);

	/*Кнопка, по нажатию на которую показывается предыдущий объект (справа)*/
	this.ShowPrevObjectButton = document.createElement("div");
	this.ShowPrevObjectButton.setAttribute("id", "ShowPrevObjectButton");
	this.ShowPrevObjectButton.addEventListener("click", this.onShowPrevObjectButtonClickBF);

	/*Кнопка покупки объекта*/
	this.BuyObjectButton = document.createElement("div");
	this.BuyObjectButton.setAttribute("id", "BuyObjectButton");
	this.BuyObjectButton.appendChild(document.createTextNode("Купить"));
	this.BuyObjectButton.addEventListener("click", this.onBuyObjectButtonClickBF);

	/*Price Label*/
	this.PriceLabel = document.createElement("div");
	this.PriceLabel.setAttribute("id", "PriceLabel");
	this.PriceLabel.appendChild(document.createTextNode("0"));

	/*Окно предпросмотра вида пользовательского Объекта*/
	this.UserObjectView = {};
	this.UserObjectView.Scene = new THREE.Scene();
	
	this.UserObjectView.Container = document.createElement("div");
	this.UserObjectView.Container.setAttribute("id", "UserObjectPreviewContainer");
	
	this.UserObjectView.Description = document.createElement("div");
	this.UserObjectView.Description.setAttribute("id", "UserObjectDescription");
	this.UserObjectView.Description.appendChild(document.createTextNode(""));

	this.UserObjectView.ViewDescriptionDiv = document.createElement("div");
	this.UserObjectView.ViewDescriptionDiv.setAttribute("id", "ViewDescriptionDiv");
	
	this.UserObjectView.Renderer = new THREE.WebGLRenderer({antialias: true, shadows: true});
	this.UserObjectView.Renderer.setSize(500, 300);	
	this.UserObjectView.WorldBox = new THREE.Mesh(new THREE.BoxGeometry(2000, 2000, 2000), new THREE.MeshStandardMaterial({color: 0xf0f9f0, side: THREE.DoubleSide}));
	this.UserObjectView.Camera = new THREE.PerspectiveCamera(
		CAMERA_PARAMETERS.ANGLE, 
		500/300, 
		CAMERA_PARAMETERS.NEAR, 
		CAMERA_PARAMETERS.FAR
	);


	this.UserObjectView.Camera.position.z = 400;

	this.ambientlight = new THREE.AmbientLight( 0xffffff, 2 );	

	this.Person = window.GLOBAL_OBJECTS.getPerson();	
	this.MeshesBase = window.GLOBAL_OBJECTS.getMeshesBase();

	/*Данные для текущего отображаемого Меша*/
	this.ShowCaseMeshData = {
		CaseMesh: null,
		CaseMeshIndex: 1,
		Price: 0,
		Description: "Description",
		Customizable: false
	};


	this.UserObjectView.Scene.add(this.UserObjectView.WorldBox);
	this.UserObjectView.Scene.add(this.ambientlight);

	this.getCaseMeshFromPersonAndLoadMesh();

	/*Секция покупки возможности кастомизации*/
	this.CustomizeSection = {};
	this.CustomizeSection.BuyCustomButton = document.createElement("div");

	this.CustomizeSection.CustomizeSectionDiv = document.createElement("div");
	this.CustomizeSection.CustomizeSectionDiv.setAttribute("id", "CustomizeSectionDiv");

	/*Ползунок выбора прозрачности*/
	this.CustomizeSection.SetOpacityRangeInput = document.createElement("input");
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("id", "CustomizeOpacityRangeInput");
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("type", "range");
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("min", 0);
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("max", 1);	
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("step", 0.01);	
	this.CustomizeSection.SetOpacityRangeInput.setAttribute("value", this.Person.VideoMesh.Case.material.opacity);
	this.CustomizeSection.SetOpacityRangeInput.addEventListener("input", this.onOpacityRangeInputChangeBF);	
	this.CustomizeSection.SetOpacityRangeLabel = document.createElement("label");
	this.CustomizeSection.SetOpacityRangeLabel.setAttribute("for", "CustomizeOpacityRangeInput");
	this.CustomizeSection.SetOpacityRangeLabel.innerText = "Прозрачность";

	/*Инпут выбора цвета граней.*/
	this.CustomizeSection.SetFaceColorInput = document.createElement("input");
	this.CustomizeSection.SetFaceColorInput.setAttribute("id", "CustomizeFaceColorInput");
	this.CustomizeSection.SetFaceColorInput.setAttribute("type", "color");
	this.CustomizeSection.SetFaceColorInput.setAttribute("value", "#" + this.Person.VideoMesh.Case.material.color.getHexString());
	this.CustomizeSection.SetFaceColorInput.addEventListener("input", this.onFaceColorInputChangeBF);
	this.CustomizeSection.SetFaceColorLabel = document.createElement("label");
	this.CustomizeSection.SetFaceColorLabel.setAttribute("for", "CustomizeFaceColorInput");
	this.CustomizeSection.SetFaceColorLabel.innerText = "Цвет объекта:";

	/*Инпут выбора цвета ребер.*/
	this.CustomizeSection.SetEdgeColorInput = document.createElement("input");
	this.CustomizeSection.SetEdgeColorInput.setAttribute("id", "CustomizeEdgeColorInput");
	this.CustomizeSection.SetEdgeColorInput.setAttribute("type", "color");
	this.CustomizeSection.SetEdgeColorInput.setAttribute("value", "#" + this.Person.VideoMesh.Case.children[0].material.color.getHexString());	
	this.CustomizeSection.SetEdgeColorInput.addEventListener("input", this.onEdgeColorInputChangeBF);	
	this.CustomizeSection.SetEdgeColorLabel = document.createElement("label");
	this.CustomizeSection.SetEdgeColorLabel.setAttribute("for", "CustomizeEdgeColorInput");
	this.CustomizeSection.SetEdgeColorLabel.innerText = "Цвет ребер:";


	this.UserObjectView.Container.appendChild(this.UserObjectView.Renderer.domElement);

	this.StoreWindowDiv.appendChild(this.ShowNextObjectButton);
	this.StoreWindowDiv.appendChild(this.ShowPrevObjectButton);
	/*Добавляем кнопку закрытия окна магазина*/
	this.StoreWindowDiv.appendChild(this.CloseWindowButton);
	/*добавили контейнер для 3d объекта*/
	this.UserObjectView.ViewDescriptionDiv.appendChild(this.UserObjectView.Container);
	this.UserObjectView.ViewDescriptionDiv.appendChild(this.UserObjectView.Description);	

	/*добавили настройку прозрачности*/
	this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetOpacityRangeLabel);	
	this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetOpacityRangeInput);
	/*добавили настройку настройку цвета ребер*/
	this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetEdgeColorLabel);	
	this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetEdgeColorInput);
	/*добавили настройку цвета граней */
	this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetFaceColorLabel);	
	this.CustomizeSection.CustomizeSectionDiv.appendChild(this.CustomizeSection.SetFaceColorInput);
	/*добавили div содержащий настройки кастомизации и */
	this.StoreWindowDiv.appendChild(this.UserObjectView.ViewDescriptionDiv);
	this.StoreWindowDiv.appendChild(this.CustomizeSection.CustomizeSectionDiv);
	/*добавили кнопку сохранения настроек*/
	this.StoreWindowDiv.appendChild(this.SaveOptionsButton);
	this.StoreWindowDiv.appendChild(this.PriceLabel);

	document.body.appendChild(this.StoreWindowDiv);

};

/*Обработчик нажатия на кнопку покупки*/
_StoreWindow.prototype.onBuyObjectButtonClick = function ()
{
	this.Person.addMeshIndexToOpenMeshesAndSaveToDB(this.ShowCaseMeshData.CaseMeshIndex);
};

/*Получаем данные из Person и загружаем первоначальный Меш*/
_StoreWindow.prototype.getCaseMeshFromPersonAndLoadMesh = function ()
{
	/*удаляем старый Меш со сцены*/
	this.UserObjectView.Scene.remove(this.ShowCaseMeshData.CaseMesh);
	/*теперь получаем данные от персоны и загружаем меш и данные из МешБейса*/
	this.ShowCaseMeshData.CaseMeshIndex = this.Person.getCaseMeshIndex();
	var tdata = this.MeshesBase.getMeshDataByMeshIndex(this.ShowCaseMeshData.CaseMeshIndex);
	if(tdata){
		this.ShowCaseMeshData.CaseMesh = tdata.mesh;
		this.ShowCaseMeshData.Price = tdata.price;
		this.ShowCaseMeshData.Description = tdata.description;	
		this.ShowCaseMeshData.Customizable = tdata.customizable;	
	}
	/*обновляем всё, что нужно обновить*/
	this.updatePriceLabel();
	this.updateMeshDescription();
	this.UserObjectView.Scene.add(this.ShowCaseMeshData.CaseMesh);
};

_StoreWindow.prototype.updatePriceLabel = function ()
{
	this.PriceLabel.firstChild.data = this.ShowCaseMeshData.Price;
};
_StoreWindow.prototype.updateMeshDescription = function ()
{
	this.UserObjectView.Description.firstChild.data = this.ShowCaseMeshData.Description;
};
/*
	Функция добавляет или удаляет кнопку покупки Меша в зависимости от того,
	куплен он уже или нет.
*/
_StoreWindow.prototype.toggleBuyButtonIfMeshWasBought = function (index)
{
	if(!arguments[0])
		var index = this.ShowCaseMeshData.CaseMeshIndex;

	if(!this.Person.isMeshIndexInOpenMeshes(index))
	{
		if(!this.StoreWindowDiv.contains(this.BuyObjectButton))
			this.StoreWindowDiv.appendChild(this.BuyObjectButton, this.SaveOptionsButton);
	} else
	{
		if(this.StoreWindowDiv.contains(this.BuyObjectButton))
			this.StoreWindowDiv.removeChild(this.BuyObjectButton);		
	}

}
/*
	Функция добавляет или удаляет кнопку покупки Меша в зависимости от того,
	куплен он уже или нет.
*/
_StoreWindow.prototype.controlCustomizeSection = function ()
{
	if(this.ShowCaseMeshData.Customizable)
	{
		if(!this.StoreWindowDiv.contains(this.CustomizeSection.CustomizeSectionDiv))
			this.StoreWindowDiv.appendChild(this.CustomizeSection.CustomizeSectionDiv);
	} else
	{
		if(this.StoreWindowDiv.contains(this.CustomizeSection.CustomizeSectionDiv))
			this.StoreWindowDiv.removeChild(this.CustomizeSection.CustomizeSectionDiv);
	}

}
/*Обработчик нажатия на кнопку обзора предыдущего объекта*/
_StoreWindow.prototype.onShowPrevObjectButtonClick = function ()
{
	this.UserObjectView.Scene.remove(this.ShowCaseMeshData.CaseMesh);
	this.ShowCaseMeshData.CaseMeshIndex = this.MeshesBase.getPrevMeshIndexByCurrentMeshIndex(this.ShowCaseMeshData.CaseMeshIndex);
	var tdata = this.MeshesBase.getMeshDataByMeshIndex(this.ShowCaseMeshData.CaseMeshIndex);
	if(tdata){
		this.ShowCaseMeshData.CaseMesh = tdata.mesh;
		this.ShowCaseMeshData.Price = tdata.price;
		this.ShowCaseMeshData.Description = tdata.description;	
		this.ShowCaseMeshData.Customizable = tdata.customizable;	
	}
	this.UserObjectView.Scene.add(this.ShowCaseMeshData.CaseMesh);
	this.toggleBuyButtonIfMeshWasBought(this.ShowCaseMeshData.CaseMeshIndex);
	this.updatePriceLabel();
	this.updateMeshDescription();
	this.controlCustomizeSection();
};
/*Обработчик нажатия на кнопку обзора следующего объекта*/
_StoreWindow.prototype.onShowNextObjectButtonClick = function ()
{
	this.UserObjectView.Scene.remove(this.ShowCaseMeshData.CaseMesh);
	this.ShowCaseMeshData.CaseMeshIndex = this.MeshesBase.getNextMeshIndexByCurrentMeshIndex(this.ShowCaseMeshData.CaseMeshIndex);
	var tdata = this.MeshesBase.getMeshDataByMeshIndex(this.ShowCaseMeshData.CaseMeshIndex);
	if(tdata){
		this.ShowCaseMeshData.CaseMesh = tdata.mesh;
		this.ShowCaseMeshData.Price = tdata.price;
		this.ShowCaseMeshData.Description = tdata.description;		
		this.ShowCaseMeshData.Customizable = tdata.customizable;	
	}
	this.UserObjectView.Scene.add(this.ShowCaseMeshData.CaseMesh);
	this.toggleBuyButtonIfMeshWasBought(this.ShowCaseMeshData.CaseMeshIndex);
	this.updatePriceLabel();
	this.updateMeshDescription();
	this.controlCustomizeSection();
};

_StoreWindow.prototype.getOpenStoreWindowListener = function ()
{
	return this.onOpenBF;
};

_StoreWindow.prototype.onOpen = function ()
{
	this.updating = true;
	requestAnimationFrame(this.updateBF);
	$("#StoreWindowDiv").show();
};

_StoreWindow.prototype.onClose = function ()
{
	this.updating = false;
	$("#StoreWindowDiv").hide();
};

/**/
_StoreWindow.prototype.update = function ()
{
	this.ShowCaseMeshData.CaseMesh.rotation.x += 0.02;
	this.UserObjectView.Renderer.render(this.UserObjectView.Scene, this.UserObjectView.Camera);
	if(this.updating === true)
		requestAnimationFrame(this.updateBF);
};

/*Загружает сохраненные настройки вида с сервера*/ 
_StoreWindow.prototype.loadSavedCustomViewParameters = function ()
{
	var send_data = "datas=" + JSON.stringify({
		operation: "get_custom_view_params",
		user_id: this.Person.getUserID()
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.setLoadedCustomViewParametersBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});	
};

/*Принимает и устанавливает полученные с сервера параметры к пользовательскому Mesh'у*/
_StoreWindow.prototype.setLoadedCustomViewParameters = function (json_params)
{
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}

	
};

/*Обработчик нажатия на кнопку сохранить*/
_StoreWindow.prototype.onSave = function ()
{
	this.Person.setCaseMeshIndex(this.ShowCaseMeshData.CaseMeshIndex);

	var send_data = "datas=" + JSON.stringify({
		vk_id: this.Person.getUserVKID(),
		opacity: this.CustomizeSection.SetOpacityRangeInput.value,
		face_color: this.CustomizeSection.SetFaceColorInput.value,
		edge_color: this.CustomizeSection.SetEdgeColorInput.value,
		date_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
		open_meshes: this.OpenMeshes,
		case_mesh_index: this.ShowCaseMeshData.CaseMeshIndex,
		operation: "save_custom_mesh_view_params"
	});
	$.ajax({
		type: "POST",
		url: "./mysql.php",
		async: true,
		success: this.onSaveSuccessBF,
		error: this.onSaveErrorBF,
		data: send_data,
		contentType: "application/x-www-form-urlencoded",
		error: function (jqXHR, textStatus,errorThrown) { console.log(errorThrown + " " + textStatus);}

	});
};

_StoreWindow.prototype.onSaveSuccess = function (json_params)
{
	console.log(json_params);
	if(typeof(json_params) === "string")
	{
		json_params = JSON.parse(json_params);
	}
	this.onCloseBF();
};

_StoreWindow.prototype.onSaveError = function (jqXHR, textStatus,errorThrown)
{ 
	console.log(errorThrown + " " + textStatus);
}

/*Когда пользователь настраивает прозрачность*/
_StoreWindow.prototype.onOpacityRangeInputChange = function ()
{
	this.Person.VideoMesh.Case.material.opacity = this.CustomizeSection.SetOpacityRangeInput.value;
};

/*Когда пользователь настраивает прозрачность*/
_StoreWindow.prototype.onFaceColorInputChange = function ()
{
	this.Person.VideoMesh.Case.material.color.setStyle(this.CustomizeSection.SetFaceColorInput.value);
};

/*Когда пользователь настраивает прозрачность*/
_StoreWindow.prototype.onEdgeColorInputChange = function ()
{
	this.Person.VideoMesh.Case.children[0].material.color.setStyle(this.CustomizeSection.SetEdgeColorInput.value);
};