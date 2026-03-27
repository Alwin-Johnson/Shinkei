package com.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "MessMenu")
public class MessMenu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private Integer menuId;

    @Enumerated(EnumType.STRING)
    @Column(name = "day", nullable = false, length = 10)
    private String day;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 10)
    private String mealType;
    
    @Column(name = "price", nullable = true)
    private Double price;

    @Column(name = "items", length = 255, nullable = false)
    private String items;

    public enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }
    public enum MealType { BREAKFAST, LUNCH, DINNER }

    public MessMenu() {}
    
    public MessMenu(String day, String mealType, Double price, String items) {
        this.day = day;
        this.mealType = mealType;
        this.price = price;
        this.items = items;
    }

    public Integer getMenuId() {
        return menuId;
    } 

    public void setMenuId(Integer menuId) {
        this.menuId = menuId;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getItems() {
        return items;
    }

    public void setItems(String items) {
        this.items = items;
    }
}
