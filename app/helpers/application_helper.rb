module ApplicationHelper
  
  def get_components_str_from_order(order)
    selected_components = order.get_selected_components
    componentText = ''
    if selected_components.any?
      txt = componentName(selected_components[selected_components.length-1]);
      
      #b and c
      #a, b and c
      second_last_component = selected_components.length-2;
      second_last_component.downto(0) {|i|
        if i == second_last_component
          componentText = componentName(selected_components[i]) + " and " + txt
        else
          componentText = componentName(selected_components[i]) + ", " + txt
        end
      }
      componentText = " with " + componentText
    end
    return componentText
  end
  
  def componentName(comp_name)
    return "<span class='selected-component'>" + comp_name + "</span>"
  end
  
  
end
