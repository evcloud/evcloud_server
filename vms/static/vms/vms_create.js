;(function () {

    //API域名
    let DOMAIN_NAME = get_domain_url(); //'http://10.0.86.213:8000/';

    // 获取API域名
    function get_api_domain_name(){
        return DOMAIN_NAME;
    }

    // 构建带域名url
    function build_absolute_url(url){
        let domain = get_api_domain_name();
        domain = domain.rightStrip('/');
        if(!url.startsWith('/'))
            url = '/' + url;
        return domain + url;
    }

    /**
     * 拼接params对象为url参数字符串
     * @param {Object} obj - 待拼接的对象
     * @returns {string} - 拼接成的query参数字符串
     */
    function encode_params(obj) {
        const params = [];

        Object.keys(obj).forEach((key) => {
            let value = obj[key];
            // 如果值为undefined我们将其置空
            if (typeof value === 'undefined') {
                value = ''
            }
            // 对于需要编码的文本我们要进行编码
            params.push([key, encodeURIComponent(value)].join('='))
        });

        return params.join('&');
    }

    // 分中心下拉框选项改变事件
    $('select[name="center_id"]').change(function () {
        this.form.submit();
    });

    // 宿主机组下拉框选项改变事件
    $('select[name="group_id"]').change(function () {
        update_host_select_items();
    });
    // 子网网段下拉框选项改变事件
    $('select[name="vlan_id"]').change(function () {
        update_host_select_items();
    });

    //
    // 加载宿主机下拉框渲染模板
    //
    let render_host_select_items = template.compile(`
        <option value="">自动选择</option>
        {{ each results }}
            <option value="{{ $value.id }}">
                {{ $value.ipv4 }}(cpu:{{$value.vcpu_allocated}}/{{$value.vcpu_total}}, 
                mem:{{$value.mem_allocated + $value.mem_reserved}}Mb/{{$value.mem_total}}Mb),
                num:{{$value.vm_created}}/{{$value.vm_limit}}
            </option>
        {{/each}}
    `);

    // 加载宿主机下拉框
    function update_host_select_items(){
        let group = $('select[name="group_id"]').val();
        let vlan = $('select[name="vlan_id"]').val();
        if(!(group && vlan)){
            return;
        }
        let qs = encode_params({group_id:group, vlan_id:vlan});
        let api = build_absolute_url('/api/v3/host/?'+ qs);
        $.ajax({
            url: api,
            type: 'get',
            async: false,
            success: function (data) {
                let html = render_host_select_items(data);
                let host = $('select[name="host_id"]');
                host.empty();
                host.append(html);
            },
            error: function (xhr) {
                alert('加载宿主机下拉框选项失败');
            }
        })
    }

    // 校验创建虚拟机参数
    function valid_vm_create_data(obj){
        if((obj.group_id <= 0) && (obj.host_id <= 0)){
            alert('机组和宿主机至少选择其一');
            return false;
        }
        if ((obj.group_id <= 0)){
            delete obj.group_id;
        }
        if ((obj.host_id <= 0)){
            delete obj.host_id;
        }
        if (obj.vlan_id <= 0){
            alert('请选择一个网段');
            return false;
        }
        if(obj.image_id <= 0){
            alert('请选择一个系统镜像');
            return false;
        }
        if(obj.vcpu <= 0){
            alert('请选择或输入一个有效的CPU数');
            return false;
        }
        if(obj.mem <= 0){
            alert('请选择或输入有效的内存大小');
            return false;
        }
        return true;
    }

    // 创建虚拟机表单提交按钮点击事件
    $('form#id-form-vm-create button[type="submit"]').click(function (e) {
        let event = e || window.event;
        event.preventDefault(); // 兼容标准浏览器
        window.event.returnValue = false; // 兼容IE6~8

        let form = $('form#id-form-vm-create');
        let obj_data = getForm2Obj(form);
        if (!valid_vm_create_data(obj_data)){
            return;
        }
        if(!confirm('确定创建虚拟机？'))
            return;

        let api = build_absolute_url('api/v3/vms/');
        let json_data = JSON.stringify(obj_data);
        let btn_submit = $(this);
        btn_submit.addClass('disabled'); //鼠标悬停时，使按钮表现为不可点击状态
        btn_submit.attr('disabled', true);//失能对应按钮
        $.ajax({
            url: api,
            type: 'post',
            data: json_data,
            contentType: 'application/json',
            success: function (data, status, xhr) {
                if (xhr.status === 201){
                    if(confirm('创建成功,是否去主机列表看看？')){
                        window.location = '/vms/';
                    }
                }else{
                    alert("创建失败！" + data.code_text);
                }
            },
            error: function (xhr) {
                let msg = '创建主机失败!';
                try{
                    msg = msg + xhr.responseJSON.code_text;
                }catch (e) {}
                alert(msg);
            },
            complete: function () {
                btn_submit.removeClass('disabled');   //鼠标悬停时，使按钮表现为可点击状态
                btn_submit.attr('disabled', false); //激活对应按钮
            }
        })
    });
})();

