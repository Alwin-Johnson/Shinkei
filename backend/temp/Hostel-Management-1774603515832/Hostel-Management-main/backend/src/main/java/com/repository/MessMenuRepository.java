package com.repository;

import com.entity.MessMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface MessMenuRepository extends JpaRepository<MessMenu, Long> {
    
    @Modifying
    @Query(value = """
        INSERT INTO MessMenu (menu_id, day, meal_type, price, items) 
        VALUES (?1, ?2, ?3, ?4, ?5) 
        """, nativeQuery = true)
    int insertMenu(Integer menuId, String day, String mealType, Double price, String items);

    @Modifying
    @Query(value = """ 
        UPDATE MessMenu 
        SET day = ?2, meal_type = ?3, price = ?4, items = ?5
        WHERE menu_id = ?1 
        """, nativeQuery = true)
    int updateMenu(Integer menuId, String day, String mealType, Double price, String items);

    @Query(value = "SELECT * FROM MessMenu WHERE day = ?1", nativeQuery = true)
    MessMenu findByDay(String day);

    @Query(value = "SELECT * FROM MessMenu", nativeQuery = true)
    List<MessMenu> findAllMenus();

}